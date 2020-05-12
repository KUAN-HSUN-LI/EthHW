pragma solidity >=0.4.21 <0.7.0;


// Reference: https://github.com/pomelyu/EthereumTodo

contract TodoApp {
    event OnTodoAdded(uint256 todoId);
    event OnTodoDeleted(uint256 todoId);
    event OnTodoCompleted(uint256 todoId);
    event OnTodoUndone(uint256 todoId);

    struct Todo {
        string taskName;
        bool isComplete;
        bool isValid;
    }

    Todo[] todos;

    // Modifier
    modifier isValidTodo(uint256 _todoId) {
        require(isTodoValid(_todoId), "Todo must be valid to call");
        _;
    }

    // Public function
    function isTodoValid(uint256 _todoId) public view returns (bool isValid) {
        return todos[_todoId].isValid;
    }

    function isTodoCompleted(uint256 _todoId)
        public
        view
        isValidTodo(_todoId)
        returns (bool isValid)
    {
        return todos[_todoId].isComplete;
    }

    function getTodo(uint256 _todoId)
        public
        view
        isValidTodo(_todoId)
        returns (string memory, bool)
    {
        return (todos[_todoId].taskName, todos[_todoId].isComplete);
    }

    function getTodoList()
        public
        view
        returns (uint256[] memory, bool[] memory)
    {
        uint256 len;
        uint256[] memory valids;

        (valids, len) = _getValidTodos();

        uint256[] memory ids = new uint256[](len);
        bool[] memory isCompletes = new bool[](len);
        for (uint256 i = 0; i < len; i++) {
            uint256 id = valids[i];
            ids[i] = id;
            isCompletes[i] = todos[id].isComplete;
        }
        return (ids, isCompletes);
    }

    function addTodo(string memory _taskName) public {
        Todo memory todo = Todo(_taskName, false, true);
        todos.push(todo);
        uint256 todoId = todos.length - 1;

        emit OnTodoAdded(todoId);
    }

    function deleteTodo(uint256 _todoId) public isValidTodo(_todoId) {
        todos[_todoId].isValid = false;

        emit OnTodoDeleted(_todoId);
    }

    function completeTodo(uint256 _todoId) public isValidTodo(_todoId) {
        todos[_todoId].isComplete = true;

        emit OnTodoCompleted(_todoId);
    }

    function undoneTodo(uint256 _todoId) public isValidTodo(_todoId) {
        todos[_todoId].isComplete = false;

        emit OnTodoUndone(_todoId);
    }

    // Private methods
    function _getValidTodos()
        private
        view
        returns (uint256[] memory valids, uint256 length)
    {
        uint256[] memory validTodos = new uint256[](todos.length);
        uint256 count = 0;
        for (uint256 i = 0; i < todos.length; i++) {
            if (isTodoValid(i)) {
                validTodos[count] = i;
                count++;
            }
        }
        return (validTodos, count);
    }
}
