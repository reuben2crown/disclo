export interface HiveSyncResponse {
    id:         string;
    code:       number;
    project_id: number;
    user_id:    number;
    created_on: Date;
    status:     HiveResponseStatus;
    from_cache: boolean;
    metadata:   string;
    return_code: number;
    message: string;
}

export interface HiveResponseStatus {
    status:   HiveStatusCode;
    response: HiveData;
}

export interface HiveStatusCode {
    code:    number;
    message: string;
}

export interface HiveData {
    input:  HiveInput;
    output: HiveOutput[];
}

export interface HiveInput {
    id:            string;
    charge:        number;
    model:         string;
    model_version: number;
    model_type:    string;
    created_on:    string;
    media:         HiveMedia;
    user_id:       number;
    project_id:    number;
}

export interface HiveMedia {
    type:     string;
    mimetype: string;
    duration: number;
    width:    number;
    height:   number;
}

export interface HiveOutput {
    time:    number;
    classes: HiveClassification[];
}

export interface HiveClassification {
    class: string;
    score: number;
}
