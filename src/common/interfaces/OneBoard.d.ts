import Lists from './Lists';

export default interface SingleBoard {
  title: string;
  custom?: object;
  users?: [];
  lists: Lists[];
}
