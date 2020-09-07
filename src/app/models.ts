
export interface Position {
  lat: number;
  lng: number;
}

type Polyline = Position[];
type Polygon = Position[];

export type TeeType = 'front' | 'back' | 'dz' | 'mando';
export type HoleNumber = number;
export type HolePath = Polyline;
export type Area = Polygon;
export type ObLine = Polyline;
export type Descriptions = string | string[];
export type CourseId = string;
export type EventId = string;
export type LocationId = string;
export type ISO_Date_String = string;

export interface Period {
  from: ISO_Date_String;
  to: ISO_Date_String;
}

export interface HoleLine {
  path: HolePath;
  par: number;
  length?: number;
}

export interface HoleMetaData {
  hole: number;
  teeType: TeeType;
  description: Descriptions;
  data: HoleLine;
  fromBacktee?: HoleLine;
  fromFronttee?: HoleLine;
}

export interface HoleData {
  number: HoleNumber;         // eg. 1,2,3,...18,...
  back?: HoleLine;            // フロントティーからターゲットまでのライン
  front?: HoleLine;           // バックティーからターゲットまでのライン
  description?: Descriptions; // OBルール
  dropzones?: Position[];     // ドロップゾーン位置
  mandos?: Position[];        // マンダトリー位置
  safeAreas?: Area[];         // セーフエリア位置
  obAreas?: Area[];           // OBエリア位置
  obLines?: ObLine[];         // OBライン位置
  hazardAreas?: Area[];       // ハザードエリア位置
}

export interface CourseItem {
  id: CourseId;               // eg. chubu_open_2019.1
  title: string;              // eg. 第1,2,3ラウンド,準決,決勝
}

//  GET course/$courseId      return CourseData
//    eg. course/chubu_open_2019.1
export interface CourseData extends CourseItem {
  description?: Descriptions; // eg. OB共通ルール
  holes: HoleData[];          // ホール情報
}

export interface LocationData {
  id: LocationId;
  title: string;
  description?: Descriptions; //
  geolocation: Position;
  prefecture: string;
}

//  GET event                 return EventData[]
//    eg. event
//  GET event/$eventId        return EventData
//    eg. event/chubu_open_2019
export interface EventData {
  id: EventId;                // eg. chubu_open_2019
  title: string;              // eg. 第19回中部オープン
  location: LocationId;
  period: Period;
  courses: CourseId[];        // eg. [chubu_open_2019.1, chubu_open_2019.4, chubu_open_2019.5]
}
