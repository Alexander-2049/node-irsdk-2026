#include <napi.h>
#include <windows.h>
#include <string>

constexpr wchar_t IRSDK_MAP_NAME[] = L"Local\\IRSDKMemMapFileName";

static std::string WinErrorToString(DWORD err)
{
    char buf[512];
    FormatMessageA(
        FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS,
        nullptr,
        err,
        MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
        buf,
        sizeof(buf),
        nullptr
    );
    return std::string(buf);
}

Napi::Value ReadIRacingSharedMemory(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();

    HANDLE hMap = OpenFileMappingW(FILE_MAP_READ, FALSE, IRSDK_MAP_NAME);
    if (!hMap)
    {
        DWORD err = GetLastError();
        Napi::Error::New(
            env,
            "OpenFileMapping failed: " + WinErrorToString(err)
        ).ThrowAsJavaScriptException();
        return env.Null();
    }

    void* ptr = MapViewOfFile(
        hMap,
        FILE_MAP_READ,
        0,
        0,
        0 // ← map entire mapping (ВАЖНО)
    );

    if (!ptr)
    {
        DWORD err = GetLastError();
        CloseHandle(hMap);
        Napi::Error::New(
            env,
            "MapViewOfFile failed: " + WinErrorToString(err)
        ).ThrowAsJavaScriptException();
        return env.Null();
    }

    // читаем header, чтобы понять реальный размер
    uint8_t* base = static_cast<uint8_t*>(ptr);

    int32_t numVars      = *reinterpret_cast<int32_t*>(base + 24);
    int32_t varHdrOffset = *reinterpret_cast<int32_t*>(base + 28);
    int32_t numBuf       = *reinterpret_cast<int32_t*>(base + 32);
    int32_t bufLen       = *reinterpret_cast<int32_t*>(base + 36);

    constexpr size_t VAR_HEADER_SIZE = 144;

    size_t totalSize =
        varHdrOffset +
        numVars * VAR_HEADER_SIZE +
        numBuf * bufLen;

    Napi::Buffer<uint8_t> buffer =
        Napi::Buffer<uint8_t>::Copy(env, base, totalSize);

    UnmapViewOfFile(ptr);
    CloseHandle(hMap);

    return buffer;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(
        "readIRacingSharedMemory",
        Napi::Function::New(env, ReadIRacingSharedMemory)
    );
    return exports;
}

NODE_API_MODULE(irsdk_node, Init)
