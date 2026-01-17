#include <napi.h>
#include <windows.h>
#include <string>

constexpr wchar_t IRSDK_MAP_NAME[] = L"Local\\IRSDKMemMapFileName";
constexpr wchar_t IRSDK_EVENT_NAME[] = L"Local\\IRSDKDataValidEvent";
constexpr char IRSDK_BROADCAST_NAME[] = "IRSDK_BROADCASTMSG";

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
    (void)IRSDK_EVENT_NAME;
    (void)IRSDK_BROADCAST_NAME;

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

    // reading header, to understand real size
    uint8_t* base = static_cast<uint8_t*>(ptr);

    int32_t sessionInfoLen = *reinterpret_cast<int32_t*>(base + 16);
    int32_t sessionInfoOffset = *reinterpret_cast<int32_t*>(base + 20);
    int32_t numVars = *reinterpret_cast<int32_t*>(base + 24);
    int32_t varHdrOffset = *reinterpret_cast<int32_t*>(base + 28);
    int32_t numBuf = *reinterpret_cast<int32_t*>(base + 32);
    int32_t bufLen = *reinterpret_cast<int32_t*>(base + 36);

    constexpr size_t VAR_HEADER_SIZE = 144;

    size_t totalSize = 0;

    if (sessionInfoLen > 0 && sessionInfoOffset > 0) {
        size_t sessionEnd = static_cast<size_t>(sessionInfoOffset) + static_cast<size_t>(sessionInfoLen);
        totalSize = sessionEnd;
    }

    if (varHdrOffset > 0 && numVars > 0) {
        size_t varHeaderEnd =
            static_cast<size_t>(varHdrOffset) +
            static_cast<size_t>(numVars) * VAR_HEADER_SIZE;
        if (varHeaderEnd > totalSize) {
            totalSize = varHeaderEnd;
        }
    }

    const size_t varBufOffset = 48;
    for (int i = 0; i < numBuf; i++) {
        const size_t bufEntryOffset = varBufOffset + static_cast<size_t>(i) * 16;
        int32_t bufOffset = *reinterpret_cast<int32_t*>(base + bufEntryOffset + 4);
        size_t bufEnd = static_cast<size_t>(bufOffset) + static_cast<size_t>(bufLen);
        if (bufEnd > totalSize) {
            totalSize = bufEnd;
        }
    }

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
