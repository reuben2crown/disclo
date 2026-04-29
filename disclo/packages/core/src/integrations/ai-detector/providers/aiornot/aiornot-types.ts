export interface AoNResponse {
    id:          string;
    // ai image and text report
    report:      AoNReport;
    external_id: string;
    created_at:  Date;

    // metadata - mostly for ai text detection
    metadata:    AoNTextMetadata;

    // error details
    detail:      AoNDetail[];
}

export interface AoNReport {
    // ai text report
    ai_text: AoNAITextReport;

    // ai image report
    ai_generated: AoNAIImageGenerated;
    deepfake:     AoNDeepfake;
    nsfw:         AoNNsfw;
    quality:      AoNNsfw;
    meta:         AoNMeta;
}

export interface AoNTextMetadata {
    word_count:      number;
    character_count: number;
    token_count:     number;
    md5:             string;
}

export interface AoNAITextReport {
    confidence:  number;
    is_detected: boolean;
    // block-level annotations - same as sentence breakdown
    annotations: Array<Array<number | string>>; 
}

export interface AoNAIImageGenerated {
    verdict:   string;
    ai:        AoNAIStatus;
    human:     AoNAIStatus;
    generator: AoNGenerator;
}

export interface AoNAIStatus {
    is_detected: boolean;
    confidence:  number;
}

export interface AoNGenerator {
    midjourney:                 AoNAIStatus;
    dall_e:                     AoNAIStatus;
    stable_diffusion:           AoNAIStatus;
    this_person_does_not_exist: AoNAIStatus;
    adobe_firefly:              AoNAIStatus;
    flux:                       AoNAIStatus;
    four_o:                     AoNAIStatus;
}

export interface AoNDeepfake {
    is_detected: boolean;
    confidence:  number;
    rois:        AoNRois[];
}

export interface AoNRois {
    is_detected: boolean;
    confidence:  number;
    bbox:        AoNBbox;
}

export interface AoNBbox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface AoNMeta {
    width:             number;
    height:            number;
    format:            string;
    size_bytes:        number;
    md5:               string;
    processing_status: AoNProcessingStatus;
}

export interface AoNProcessingStatus {
    ai_generated: string;
    deepfake:     string;
    nsfw:         string;
    quality:      string;
}

export interface AoNNsfw {
    is_detected: boolean;
}

// error details
export interface AoNDetail {
    loc:  string[];
    msg:  string;
    type: string;
}
