{
    "targets": [
        {
            "target_name": "irsdk_node",
            "default_configuration": "Release",
            "cflags": [ "-Wall", "-std=c++11" ],
            "sources": [],
            "defines": [
                "NAPI_DISABLE_CPP_EXCEPTIONS",
            ],
            "include_dirs": [
                "<!(node -p \"require('node-addon-api').include_dir\")",
            ],
            "configurations": {
              "Release": { 
                "msvs_settings": {
                  "VCCLCompilerTool": {
                      "ExceptionHandling": 1
                  }
                }
              }
            },
            "conditions": [
                [
                    "OS=='win'",
                    {
                        "sources": [
                            "src/app/games/iRacing/lib/test.cc",
                            # "src/app/irsdk/native/lib/irsdk_utils.cpp",
                            # "src/app/irsdk/native/lib/yaml_parser.cpp",
                            # "src/app/irsdk/native/lib/irsdk_defines.h",
                        ]
                    },
                ]
            ],
        }
    ]
}