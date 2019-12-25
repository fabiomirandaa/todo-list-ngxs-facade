import { Todo } from '../models/Todo';

export namespace TodoActions {

  export class Add {
    static readonly type = '[Todo] Add';

    constructor(public payload: Todo) {
    }
  }

  export class Get {
    static readonly type = '[Todo] Get';
  }

  export class Update {
    static readonly type = '[Todo] Update';

    constructor(public payload: Todo, public id: number) {
    }
  }

  export class Delete {
    static readonly type = '[Todo] Delete';

    constructor(public id: number) {
    }
  }

  export class SetSelected {
    static readonly type = '[Todo] Set';

    constructor(public payload: Todo) {
    }
  }

}
