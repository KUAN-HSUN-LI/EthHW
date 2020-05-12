var Nmlabtoken = artifacts.require('Nmlabtoken');

const INITIAL_SUPPLY = 10000;

contract('Nmlabtoken', accounts => {
	it('testTransfer', async function () {
		const transfer_amount = 1000;
		let contract = await Nmlabtoken.deployed();

		let accout0balance = await contract.balanceOf(accounts[0]);
		let accout1balance = await contract.balanceOf(accounts[1]);
		assert.equal(accout0balance.toNumber(), INITIAL_SUPPLY);
		assert.equal(accout1balance.toNumber(), 0);

		await contract.transfer(accounts[1], transfer_amount);
		accout0balance = await contract.balanceOf(accounts[0]);
		accout1balance = await contract.balanceOf(accounts[1]);
		assert.equal(accout0balance.toNumber(), INITIAL_SUPPLY - transfer_amount);
		assert.equal(accout1balance.toNumber(), transfer_amount);
	});
});

contract('Nmlabtoken', accounts => {
	it('testAllowance', async function () {
		const approve_amount = 1000;
		const transfer_amount = 100;
		let contract = await Nmlabtoken.deployed();
		await contract.approve(accounts[0], approve_amount);

		let allow_amount = await contract.allowance(accounts[0], accounts[0]);
		assert.equal(allow_amount.toNumber(), approve_amount);

		await contract.transferFrom(accounts[0], accounts[1], transfer_amount);
		allow_amount = await contract.allowance(accounts[0], accounts[0]);
		assert.equal(allow_amount.toNumber(), approve_amount - transfer_amount);
	});
});

contract('Nmlabtoken', accounts => {
	it('testApprove', async function () {
		let approve_amount = 1000;
		let contract = await Nmlabtoken.deployed();
		await contract.approve(accounts[0], approve_amount).catch(err => {
			assert(err);
		});
	});
	it('testTransferFrom', async function () {
		let transfer_amount = 800;
		let contract = await Nmlabtoken.deployed();
		transferFrom_result = await contract.transferFrom(accounts[0], accounts[1], transfer_amount);
		allow_amount = await contract.allowance(accounts[0], accounts[0]);
		assert.equal(allow_amount.toNumber(), 1000 - transfer_amount);
	});
});
