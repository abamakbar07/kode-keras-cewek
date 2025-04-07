export interface DialogLine {
  character: string;
  text: string;
}

export interface Choice {
  text: string;
  label: string;
  isCorrect: boolean;
}

export interface GameScene {
  sceneTitle: string;
  situation: string;
  dialogue: DialogLine[];
  choices: Choice[];
  explanation: string;
} 