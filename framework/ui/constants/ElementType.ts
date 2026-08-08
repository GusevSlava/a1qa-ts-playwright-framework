interface IElementType {
  readonly BUTTON: string;
  readonly CHECKBOX: string;
  readonly DROPDOWN: string;
  readonly LABEL: string;
  readonly TEXT_BOX: string;
  readonly FILE_INPUT: string;
}

const ElementType: IElementType = Object.freeze({
  BUTTON: 'Button',
  CHECKBOX: 'Checkbox',
  DROPDOWN: 'Dropdown',
  LABEL: 'Label',
  TEXT_BOX: 'Text Box',
  FILE_INPUT: 'File Input',
});

export default ElementType;
