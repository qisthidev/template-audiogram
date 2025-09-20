import { Composition, staticFile } from "remotion";
import { Audiogram } from "./Audiogram/Main";
import { audiogramSchema } from "./Audiogram/schema";
import { getSubtitles } from "./helpers/fetch-captions";
import { FPS } from "./helpers/ms-to-frame";
import { parseMedia } from "@remotion/media-parser";
import { AMPLIKIT_THEME } from "./Audiogram/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Audiogram"
        component={Audiogram}
        width={1080}
        height={1080}
        schema={audiogramSchema}
        defaultProps={{
          // audio settings
          audioOffsetInSeconds: 0,
          audioFileUrl: staticFile("audio.wav"),
          // podcast data
          coverImageUrl: staticFile("amplikit-cover.svg"),
          titleText: "AmpliKIT Insights",
          titleColor: AMPLIKIT_THEME.colors.textPrimary,
          // source credit
          sourceCredit: "Original Podcast Name",
          sourceCreditColor: AMPLIKIT_THEME.colors.primary,
          // captions settings
          captions: null,
          captionsFileName: staticFile("captions.json"),
          onlyDisplayCurrentSentence: true,
          captionsTextColor: AMPLIKIT_THEME.colors.captionText,
          // visualizer settings
          visualizer: {
            type: "spectrum",
            color: AMPLIKIT_THEME.colors.waveGradientStart,
            numberOfSamples: "128" as const,
            mirrorWave: true,
            freqRangeStartIndex: 5,
            linesToDisplay: 65,
          },
        }}
        // Determine the length of the video based on the duration of the audio file
        calculateMetadata={async ({ props }) => {
          const captions = await getSubtitles(props.captionsFileName);
          const { slowDurationInSeconds } = await parseMedia({
            src: props.audioFileUrl,
            acknowledgeRemotionLicense: true,
            fields: {
              slowDurationInSeconds: true,
            },
          });

          return {
            durationInFrames: Math.floor(
              (slowDurationInSeconds - props.audioOffsetInSeconds) * FPS,
            ),
            props: {
              ...props,
              captions,
            },
            fps: FPS,
          };
        }}
      />
    </>
  );
};
