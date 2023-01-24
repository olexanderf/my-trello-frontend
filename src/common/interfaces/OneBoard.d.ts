import Lists from './Lists';

export default interface OneBoard {
  title: string;
  custom?: object;
  users?: [];
  lists: Lists[];
}
