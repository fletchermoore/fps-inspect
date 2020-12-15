

enum PrimaryState
{
    Initialized,
    Extracting,
    Extracted,
    Processing,
    Processed
}

enum ExtractingSubState {
    SelectingVideo,
    RunningFfmpeg,
    Finished
}

enum ProcessingSubState {
    PreprocessingImage,
    RunningTesseract,
    Finished
}

export default class State {

}