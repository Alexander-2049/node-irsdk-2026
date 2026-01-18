export interface IracingSessionInfo extends Record<string, unknown> {
  WeekendInfo?: IracingWeekendInfo;
  SessionInfo?: IracingSessionInfoBlock;
  QualifyResultsInfo?: IracingQualifyResultsInfo;
  CameraInfo?: IracingCameraInfo;
  RadioInfo?: IracingRadioInfo;
  DriverInfo?: IracingDriverInfo;
  SplitTimeInfo?: IracingSplitTimeInfo;
}

export interface TrackDrawing {
  active: {
    inside: string;
    outside: string;
    trackPathPoints?: { x: number; y: number }[];
    totalLength?: number;
  };
  startFinish: {
    line?: string;
    arrow?: string;
    point?: { x?: number; y?: number; length?: number } | null;
    direction?: "clockwise" | "anticlockwise" | null;
  };
  turns?: {
    x?: number;
    y?: number;
    content?: string;
  }[];
}

export interface IracingWeekendInfo {
  BuildTarget?: string;
  BuildType?: string;
  BuildVersion?: string;
  Category?: string;
  DCRuleSet?: string;
  EventType?: string;
  HeatRacing?: number;
  LeagueID?: number;
  MaxDrivers?: number;
  MinDrivers?: number;
  NumCarClasses?: number;
  NumCarTypes?: number;
  Official?: number;
  QualifierMustStartRace?: number;
  RaceFarm?: string;
  RaceWeek?: number;
  SeasonID?: number;
  SeriesID?: number;
  SessionID?: number;
  SimMode?: string;
  SubSessionID?: number;
  TeamRacing?: number;
  TelemetryOptions?: Record<string, unknown>;
  TrackAirDensity?: string;
  TrackAirPressure?: string;
  TrackAirTemp?: string;
  TrackAltitude?: string;
  TrackCity?: string;
  TrackCleanup?: number;
  TrackConfigName?: string;
  TrackCountry?: string;
  TrackDirection?: string;
  TrackDisplayName?: string;
  TrackDisplayShortName?: string;
  TrackDynamicTrack?: number;
  TrackFogLevel?: string;
  TrackID?: number;
  TrackLatitude?: string;
  TrackLength?: string;
  TrackLengthOfficial?: string;
  TrackLongitude?: string;
  TrackName?: string;
  TrackNorthOffset?: string;
  TrackNumPitStalls?: number;
  TrackNumTurns?: number;
  TrackPaceSpeed?: string;
  TrackPitSpeedLimit?: string;
  TrackPrecipitation?: string;
  TrackRelativeHumidity?: string;
  TrackSkies?: string;
  TrackState?: string;
  TrackSurfaceTemp?: string;
  TrackSurfaceTempCrew?: string;
  TrackType?: string;
  TrackVersion?: string;
  TrackWeatherType?: string;
  TrackWindDir?: string;
  TrackWindVel?: string;
  WeekendOptions?: Record<string, unknown>;
}

export interface IracingSessionInfoBlock {
  CurrentSessionNum?: number;
  Sessions?: IracingSession[];
}

export interface IracingSession {
  ResultsAverageLapTime?: number;
  ResultsFastestLap?: IracingFastestLapResult[];
  ResultsLapsComplete?: number;
  ResultsNumCautionFlags?: number;
  ResultsNumCautionLaps?: number;
  ResultsNumLeadChanges?: number;
  ResultsOfficial?: number;
  ResultsPositions?: IracingSessionResultPosition[];
  SessionEnforceTireCompoundChange?: number;
  SessionLaps?: number | string;
  SessionName?: string;
  SessionNum?: number;
  SessionNumLapsToAvg?: number;
  SessionRunGroupsUsed?: number;
  SessionSkipped?: number;
  SessionSubType?: string;
  SessionTime?: string;
  SessionTrackRubberState?: string;
  SessionType?: string;
}

export interface IracingFastestLapResult {
  CarIdx?: number;
  FastestLap?: number;
  FastestTime?: number;
}

export interface IracingSessionResultPosition {
  CarIdx?: number;
  ClassPosition?: number;
  FastestLap?: number;
  FastestTime?: number;
  Incidents?: number;
  JokerLapsComplete?: number;
  Lap?: number;
  LapsComplete?: number;
  LapsDriven?: number;
  LapsLed?: number;
  LastTime?: number;
  Position?: number;
  ReasonOutId?: number;
  ReasonOutStr?: string;
  Time?: number;
}

export interface IracingQualifyResultsInfo {
  Results?: IracingQualifyResult[];
}

export interface IracingQualifyResult {
  CarIdx?: number;
  ClassPosition?: number;
  FastestLap?: number;
  FastestTime?: number;
  Position?: number;
}

export interface IracingCameraInfo {
  Groups?: IracingCameraGroup[];
}

export interface IracingCameraGroup {
  Cameras?: IracingCamera[];
  GroupName?: string;
  GroupNum?: number;
  IsScenic?: boolean;
}

export interface IracingCamera {
  CameraName?: string;
  CameraNum?: number;
}

export interface IracingRadioInfo {
  SelectedRadioNum?: number;
  Radios?: IracingRadio[];
}

export interface IracingRadio {
  Frequencies?: string;
  HopCount?: number;
  NumFrequencies?: number;
  RadioNum?: number;
  ScanningIsOn?: number;
  TunedToFrequencyNum?: number;
}

export interface IracingDriverInfo {
  DriverBrakeCurvingFactor?: number;
  DriverCarEngCylinderCount?: number;
  DriverCarEstLapTime?: number;
  DriverCarFuelKgPerLtr?: number;
  DriverCarFuelMaxLtr?: number;
  DriverCarGearNeutral?: number;
  DriverCarGearNumForward?: number;
  DriverCarGearReverse?: number;
  DriverCarIdleRPM?: number;
  DriverCarIdx?: number;
  DriverCarIsElectric?: number;
  DriverCarMaxFuelPct?: number;
  DriverCarRedLine?: number;
  DriverCarSLBlinkRPM?: number;
  DriverCarSLFirstRPM?: number;
  DriverCarSLLastRPM?: number;
  DriverCarSLShiftRPM?: number;
  DriverCarShiftAid?: string;
  DriverCarVersion?: string;
  DriverGearboxControlType?: string;
  DriverGearboxType?: string;
  DriverHeadPosX?: number;
  DriverHeadPosY?: number;
  DriverHeadPosZ?: number;
  DriverIncidentCount?: number;
  DriverIsAdmin?: number;
  DriverPitTrkPct?: number;
  DriverSetupIsModified?: number;
  DriverSetupLoadTypeName?: string;
  DriverSetupName?: string;
  DriverSetupPassedTech?: number;
  DriverTires?: IracingDriverTire[];
  DriverUserID?: number;
  Drivers?: IracingDriver[];
  PaceCarIdx?: number;
}

export interface IracingDriverTire {
  TireCompoundType?: string;
  TireIndex?: number;
}

export interface IracingDriver {
  AbbrevName?: string;
  BodyType?: number;
  CarCfg?: number;
  CarCfgCustomPaintExt?: string;
  CarCfgName?: string;
  CarClassColor?: number;
  CarClassDryTireSetLimit?: string;
  CarClassEstLapTime?: number;
  CarClassID?: number;
  CarClassLicenseLevel?: number;
  CarClassMaxFuelPct?: string;
  CarClassPowerAdjust?: string;
  CarClassRelSpeed?: number;
  CarClassShortName?: string;
  CarClassWeightPenalty?: string;
  CarDesignStr?: string;
  CarID?: number;
  CarIdx?: number;
  CarIsAI?: number;
  CarIsElectric?: number;
  CarIsPaceCar?: number;
  CarNumber?: string;
  CarNumberDesignStr?: string;
  CarNumberRaw?: number;
  CarPath?: string;
  CarScreenName?: string;
  CarScreenNameShort?: string;
  CarSponsor_1?: number;
  CarSponsor_2?: number;
  CurDriverIncidentCount?: number;
  FaceType?: number;
  HelmetDesignStr?: string;
  HelmetType?: number;
  IRating?: number;
  Initials?: string;
  IsSpectator?: number;
  LicColor?: number;
  LicLevel?: number;
  LicString?: string;
  LicSubLevel?: number;
  SuitDesignStr?: string;
  TeamID?: number;
  TeamIncidentCount?: number;
  TeamName?: string;
  UserID?: number;
  UserName?: string;
}

export interface IracingSplitTimeInfo {
  Sectors?: IracingSplitTimeSector[];
}

export interface IracingSplitTimeSector {
  SectorNum?: number;
  SectorStartPct?: number;
}

export interface IracingTelemetry {
  [key: string]:
    | number
    | boolean
    | string
    | number[]
    | boolean[]
    | undefined;
  AirDensity?: number;
  AirPressure?: number;
  AirTemp?: number;
  Brake?: number;
  BrakeABSactive?: boolean;
  BrakeRaw?: number;
  CamCameraNumber?: number;
  CamCameraState?: number;
  CamCarIdx?: number;
  CamGroupNumber?: number;
  CarDistAhead?: number;
  CarDistBehind?: number;
  CarIdxBestLapNum?: number[];
  CarIdxBestLapTime?: number[];
  CarIdxClass?: number[];
  CarIdxClassPosition?: number[];
  CarIdxEstTime?: number[];
  CarIdxF2Time?: number[];
  CarIdxFastRepairsUsed?: number[];
  CarIdxGear?: number[];
  CarIdxLap?: number[];
  CarIdxLapCompleted?: number[];
  CarIdxLapDistPct?: number[];
  CarIdxLastLapTime?: number[];
  CarIdxOnPitRoad?: boolean[];
  CarIdxP2P_Count?: number[];
  CarIdxP2P_Status?: boolean[];
  CarIdxPaceFlags?: number[];
  CarIdxPaceLine?: number[];
  CarIdxPaceRow?: number[];
  CarIdxPosition?: number[];
  CarIdxQualTireCompound?: number[];
  CarIdxQualTireCompoundLocked?: boolean[];
  CarIdxRPM?: number[];
  CarIdxSessionFlags?: number[];
  CarIdxSteer?: number[];
  CarIdxTireCompound?: number[];
  CarIdxTrackSurface?: number[];
  CarIdxTrackSurfaceMaterial?: number[];
  CarLeftRight?: number;
  ChanAvgLatency?: number;
  ChanClockSkew?: number;
  ChanLatency?: number;
  ChanPartnerQuality?: number;
  ChanQuality?: number;
  Clutch?: number;
  ClutchRaw?: number;
  CpuUsageBG?: number;
  CpuUsageFG?: number;
  DCDriversSoFar?: number;
  DCLapStatus?: number;
  DisplayUnits?: number;
  DriverMarker?: boolean;
  Engine0_RPM?: number;
  EngineWarnings?: number;
  EnterExitReset?: number;
  FastRepairAvailable?: number;
  FastRepairUsed?: number;
  FogLevel?: number;
  FrameRate?: number;
  FrontTireSetsAvailable?: number;
  FrontTireSetsUsed?: number;
  FuelLevel?: number;
  FuelLevelPct?: number;
  FuelPress?: number;
  FuelUsePerHour?: number;
  Gear?: number;
  GpuUsage?: number;
  HandbrakeRaw?: number;
  IsDiskLoggingActive?: boolean;
  IsDiskLoggingEnabled?: boolean;
  IsGarageVisible?: boolean;
  IsInGarage?: boolean;
  IsOnTrack?: boolean;
  IsOnTrackCar?: boolean;
  IsReplayPlaying?: boolean;
  LFTiresAvailable?: number;
  LFTiresUsed?: number;
  LFbrakeLinePress?: number;
  LFcoldPressure?: number;
  LFodometer?: number;
  LFshockDefl?: number;
  LFshockDefl_ST?: number[];
  LFshockVel?: number;
  LFshockVel_ST?: number[];
  LFtempCL?: number;
  LFtempCM?: number;
  LFtempCR?: number;
  LFwearL?: number;
  LFwearM?: number;
  LFwearR?: number;
  LRTiresAvailable?: number;
  LRTiresUsed?: number;
  LRbrakeLinePress?: number;
  LRcoldPressure?: number;
  LRodometer?: number;
  LRshockDefl?: number;
  LRshockDefl_ST?: number[];
  LRshockVel?: number;
  LRshockVel_ST?: number[];
  LRtempCL?: number;
  LRtempCM?: number;
  LRtempCR?: number;
  LRwearL?: number;
  LRwearM?: number;
  LRwearR?: number;
  Lap?: number;
  LapBestLap?: number;
  LapBestLapTime?: number;
  LapBestNLapLap?: number;
  LapBestNLapTime?: number;
  LapCompleted?: number;
  LapCurrentLapTime?: number;
  LapDeltaToBestLap?: number;
  LapDeltaToBestLap_DD?: number;
  LapDeltaToBestLap_OK?: boolean;
  LapDeltaToOptimalLap?: number;
  LapDeltaToOptimalLap_DD?: number;
  LapDeltaToOptimalLap_OK?: boolean;
  LapDeltaToSessionBestLap?: number;
  LapDeltaToSessionBestLap_DD?: number;
  LapDeltaToSessionBestLap_OK?: boolean;
  LapDeltaToSessionLastlLap?: number;
  LapDeltaToSessionLastlLap_DD?: number;
  LapDeltaToSessionLastlLap_OK?: boolean;
  LapDeltaToSessionOptimalLap?: number;
  LapDeltaToSessionOptimalLap_DD?: number;
  LapDeltaToSessionOptimalLap_OK?: boolean;
  LapDist?: number;
  LapDistPct?: number;
  LapLasNLapSeq?: number;
  LapLastLapTime?: number;
  LapLastNLapTime?: number;
  LatAccel?: number;
  LatAccel_ST?: number[];
  LeftTireSetsAvailable?: number;
  LeftTireSetsUsed?: number;
  LoadNumTextures?: boolean;
  LongAccel?: number;
  LongAccel_ST?: number[];
  ManifoldPress?: number;
  ManualBoost?: boolean;
  ManualNoBoost?: boolean;
  MemPageFaultSec?: number;
  MemSoftPageFaultSec?: number;
  OilLevel?: number;
  OilPress?: number;
  OilTemp?: number;
  OkToReloadTextures?: boolean;
  OnPitRoad?: boolean;
  P2P_Count?: number;
  P2P_Status?: boolean;
  PaceMode?: number;
  PitOptRepairLeft?: number;
  PitRepairLeft?: number;
  PitSvFlags?: number;
  PitSvFuel?: number;
  PitSvLFP?: number;
  PitSvLRP?: number;
  PitSvRFP?: number;
  PitSvRRP?: number;
  PitSvTireCompound?: number;
  Pitch?: number;
  PitchRate?: number;
  PitchRate_ST?: number[];
  PitsOpen?: boolean;
  PitstopActive?: boolean;
  PlayerCarClass?: number;
  PlayerCarClassPosition?: number;
  PlayerCarDriverIncidentCount?: number;
  PlayerCarDryTireSetLimit?: number;
  PlayerCarIdx?: number;
  PlayerCarInPitStall?: boolean;
  PlayerCarMyIncidentCount?: number;
  PlayerCarPitSvStatus?: number;
  PlayerCarPosition?: number;
  PlayerCarPowerAdjust?: number;
  PlayerCarSLBlinkRPM?: number;
  PlayerCarSLFirstRPM?: number;
  PlayerCarSLLastRPM?: number;
  PlayerCarSLShiftRPM?: number;
  PlayerCarTeamIncidentCount?: number;
  PlayerCarTowTime?: number;
  PlayerCarWeightPenalty?: number;
  PlayerFastRepairsUsed?: number;
  PlayerIncidents?: number;
  PlayerTireCompound?: number;
  PlayerTrackSurface?: number;
  PlayerTrackSurfaceMaterial?: number;
  Precipitation?: number;
  PushToPass?: boolean;
  PushToTalk?: boolean;
  RFTiresAvailable?: number;
  RFTiresUsed?: number;
  RFbrakeLinePress?: number;
  RFcoldPressure?: number;
  RFodometer?: number;
  RFshockDefl?: number;
  RFshockDefl_ST?: number[];
  RFshockVel?: number;
  RFshockVel_ST?: number[];
  RFtempCL?: number;
  RFtempCM?: number;
  RFtempCR?: number;
  RFwearL?: number;
  RFwearM?: number;
  RFwearR?: number;
  RPM?: number;
  RRTiresAvailable?: number;
  RRTiresUsed?: number;
  RRbrakeLinePress?: number;
  RRcoldPressure?: number;
  RRodometer?: number;
  RRshockDefl?: number;
  RRshockDefl_ST?: number[];
  RRshockVel?: number;
  RRshockVel_ST?: number[];
  RRtempCL?: number;
  RRtempCM?: number;
  RRtempCR?: number;
  RRwearL?: number;
  RRwearM?: number;
  RRwearR?: number;
  RaceLaps?: number;
  RadioTransmitCarIdx?: number;
  RadioTransmitFrequencyIdx?: number;
  RadioTransmitRadioIdx?: number;
  RearTireSetsAvailable?: number;
  RearTireSetsUsed?: number;
  RelativeHumidity?: number;
  ReplayFrameNum?: number;
  ReplayFrameNumEnd?: number;
  ReplayPlaySlowMotion?: boolean;
  ReplayPlaySpeed?: number;
  ReplaySessionNum?: number;
  ReplaySessionTime?: number;
  RightTireSetsAvailable?: number;
  RightTireSetsUsed?: number;
  Roll?: number;
  RollRate?: number;
  RollRate_ST?: number[];
  SessionFlags?: number;
  SessionJokerLapsRemain?: number;
  SessionLapsRemain?: number;
  SessionLapsRemainEx?: number;
  SessionLapsTotal?: number;
  SessionNum?: number;
  SessionOnJokerLap?: boolean;
  SessionState?: number;
  SessionTick?: number;
  SessionTime?: number;
  SessionTimeOfDay?: number;
  SessionTimeRemain?: number;
  SessionTimeTotal?: number;
  SessionUniqueID?: number;
  ShiftGrindRPM?: number;
  ShiftIndicatorPct?: number;
  ShiftPowerPct?: number;
  Shifter?: number;
  Skies?: number;
  SolarAltitude?: number;
  SolarAzimuth?: number;
  Speed?: number;
  SteeringFFBEnabled?: boolean;
  SteeringWheelAngle?: number;
  SteeringWheelAngleMax?: number;
  SteeringWheelLimiter?: number;
  SteeringWheelMaxForceNm?: number;
  SteeringWheelPctDamper?: number;
  SteeringWheelPctIntensity?: number;
  SteeringWheelPctSmoothing?: number;
  SteeringWheelPctTorque?: number;
  SteeringWheelPctTorqueSign?: number;
  SteeringWheelPctTorqueSignStops?: number;
  SteeringWheelPeakForceNm?: number;
  SteeringWheelTorque?: number;
  SteeringWheelTorque_ST?: number[];
  SteeringWheelUseLinear?: boolean;
  Throttle?: number;
  ThrottleRaw?: number;
  TireLF_RumblePitch?: number;
  TireLR_RumblePitch?: number;
  TireRF_RumblePitch?: number;
  TireRR_RumblePitch?: number;
  TireSetsAvailable?: number;
  TireSetsUsed?: number;
  TrackTemp?: number;
  TrackTempCrew?: number;
  TrackWetness?: number;
  VelocityX?: number;
  VelocityX_ST?: number[];
  VelocityY?: number;
  VelocityY_ST?: number[];
  VelocityZ?: number;
  VelocityZ_ST?: number[];
  VertAccel?: number;
  VertAccel_ST?: number[];
  VidCapActive?: boolean;
  VidCapEnabled?: boolean;
  Voltage?: number;
  WaterLevel?: number;
  WaterTemp?: number;
  WeatherDeclaredWet?: boolean;
  WindDir?: number;
  WindVel?: number;
  Yaw?: number;
  YawNorth?: number;
  YawRate?: number;
  YawRate_ST?: number[];
  dcABS?: number;
  dcBrakeBias?: number;
  dcDashPage?: number;
  dcHeadlightFlash?: boolean;
  dcLowFuelAccept?: boolean;
  dcPitSpeedLimiterToggle?: boolean;
  dcStarter?: boolean;
  dcThrottleShape?: number;
  dcToggleWindshieldWipers?: boolean;
  dcTractionControl?: number;
  dcTriggerWindshieldWipers?: boolean;
  dpFastRepair?: number;
  dpFuelAddKg?: number;
  dpFuelAutoFillActive?: number;
  dpFuelAutoFillEnabled?: number;
  dpFuelFill?: number;
  dpLFTireChange?: number;
  dpLFTireColdPress?: number;
  dpLRTireChange?: number;
  dpLRTireColdPress?: number;
  dpRFTireChange?: number;
  dpRFTireColdPress?: number;
  dpRRTireChange?: number;
  dpRRTireColdPress?: number;
  dpWindshieldTearoff?: number;
}
