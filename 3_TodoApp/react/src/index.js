/* Reference: https://codepen.io/marekdano/pen/bVNYpq
Todo app structure

TodoApp
	- TodoHeader
	- TodoList
    - TodoListItem #1
		- TodoListItem #2
		  ...
		- TodoListItem #N
	- TodoForm
*/

import React from 'react';
import ReactDOM from 'react-dom';
import getWeb3 from './utils/getWeb3';

import TodoAppContract from './build/contracts/TodoApp.json';

import TodoHeader from './pages/TodoHeader';
import TodoForm from './pages/TodoForm';
import TodoList from './pages/TodoList';
import './index.css';

class TodoApp extends React.Component {
	constructor(props) {
		super(props);
		this.addItem = this.addItem.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.markTodoDone = this.markTodoDone.bind(this);
		this.state = { todoItems: [], web3: null, accounts: null, contract: null };
	}

	componentDidMount = async () => {
		try {
			const web3 = await getWeb3();
			const accounts = await web3.eth.getAccounts();
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = TodoAppContract.networks[networkId];
			const instance = await new web3.eth.Contract(TodoAppContract.abi, deployedNetwork && deployedNetwork.address);
			// const todoList = await instance.methods.getTodoList().call();
			console.log(accounts, instance);
			this.setState({ web3, accounts, contract: instance });
		} catch (error) {
			alert(`Failed to load web3, accounts, or contract. Check console for details.`);
			console.error(error);
		}
	};
	// componentDidUpdate() {
	// 	console.log(this.state.todoItems);
	// }
	/* YOUR CODE HERE */
	// Maybe you sould take a look at https://github.com/truffle-box/react-box

	addItem = async todoItem => {
		const { accounts, contract } = this.state;
		await contract.methods
			.addTodo(todoItem.newItemValue)
			.send({ from: accounts[0] })
			.then(() => {
				this.setState(state =>
					state.todoItems.push({
						index: state.todoItems.length + 1,
						value: todoItem.newItemValue,
						done: false,
					})
				);
			});
	};
	removeItem = async itemIndex => {
		const { accounts, contract } = this.state;
		await contract.methods
			.deleteTodo(itemIndex)
			.send({ from: accounts[0] })
			.then(() => {
				let todoItems = this.state.todoItems;
				todoItems[itemIndex] = null;
				this.setState({ todoItems: todoItems });
			});
	};
	markTodoDone = async itemIndex => {
		const { accounts, contract } = this.state;
		let todoItem = this.state.todoItems[itemIndex];
		if (todoItem.done) {
			await contract.methods
				.undoneTodo(itemIndex)
				.send({ from: accounts[0] })
				.then(() => {
					this.setState(state => (state.todoItems[itemIndex].done = !state.todoItems[itemIndex].done));
				});
		} else {
			await contract.methods
				.completeTodo(itemIndex)
				.send({ from: accounts[0] })
				.then(() => {
					this.setState(state => (state.todoItems[itemIndex].done = !state.todoItems[itemIndex].done));
				});
		}
	};

	/* END OF YOUR CODE */

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div id="main">
				<TodoHeader />
				<TodoList items={this.state.todoItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone} />
				<TodoForm addItem={this.addItem} />
			</div>
		);
	}
}

ReactDOM.render(<TodoApp />, document.getElementById('root'));
