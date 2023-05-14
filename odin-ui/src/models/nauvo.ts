export interface Viewport {
    latitude: number,
    longitude: number,
    zoom: number
}

export interface LocationMarker {
    latitude: number,
    longitude: number,
    anchor: string
}

export interface SARImageCoordinatesNauvo {
    nauvo_image : any
}

export interface LighthouseMarker {
    latitude: number,
    longitude: number,
    range: number
}