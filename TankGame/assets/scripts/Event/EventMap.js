
//every Manager need use event to communicate
const EventMap={

    //about initial
    "InitialManagerInitial":"InitialManagerInitial",
    "GameFlowManagerInitial":"GameFlowManagerInitial",
    "ResourceManagerInitial":"ResourceManagerInitial",
    "SoundManagerInitial":"SoundManagerInitial",
    "LoadingManagerInitial":"LoadingManagerInitial",
    "MapManagerInitial":"MapManagerInitial",
    "ReportInitialOK":"ReportInitialOK",
    "ReportInitialFinish":"ReportInitialFinish",

    //about loading
    "OpenLoading":"OpenLoading",
    "OffLoading":"OffLoading",

    //about get prefab
    "GetPrefab":"GetPrefab",
   
}

module.exports = EventMap;
