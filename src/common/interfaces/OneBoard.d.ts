import Lists from './Lists';

export default interface SingleBoard {
  title: string;
  lists: Lists[];
  custom?: object;
  users?: [];
}
