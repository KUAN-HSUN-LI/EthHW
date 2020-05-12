import React, { Fragment } from 'react';
import TodoListItem from './TodoListItem';

class TodoList extends React.Component {
	render() {
		var items = this.props.items.map((item, index) => {
			return item ? (
				<TodoListItem
					key={index}
					item={item}
					index={index}
					removeItem={this.props.removeItem}
					markTodoDone={this.props.markTodoDone}
				/>
			) : (
				<Fragment key={index} />
			);
		});
		return <ul className="list-group"> {items} </ul>;
	}
}

export default TodoList;
