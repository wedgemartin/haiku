// Declaration file for modules without TypeScript definitions

declare module 'font-picker-react' {
  interface FontPickerProps {
    apiKey: string;
    activeFontFamily: string;
    onChange: (nextFont: { family: string }) => void;
  }
  
  const FontPicker: React.FC<FontPickerProps>;
  export default FontPicker;
}

declare module 'syllable' {
  export function syllable(text: string): number;
}

// For image imports
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}