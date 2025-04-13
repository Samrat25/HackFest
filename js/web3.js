// web3.js - Handles Web3 and blockchain interactions

// Contract ABI and bytecode (will be filled after contract compilation)
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_documentHash",
				"type": "string"
			}
		],
		"name": "deleteDocument",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "documentHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DocumentDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "documentHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DocumentRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_documentHash",
				"type": "string"
			}
		],
		"name": "registerDocument",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_documentHash",
				"type": "string"
			}
		],
		"name": "getDocument",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "documentHash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getDocumentCountByOwner",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "startIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getDocumentsByOwner",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_documentHash",
				"type": "string"
			}
		],
		"name": "isDocumentRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Contract bytecode - this should be replaced with actual bytecode after compilation from Remix
const contractBytecode = '0x6080604052348015600e575f80fd5b50611a708061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610060575f3560e01c806313a3d9a114610064578063635994f8146100945780637641b305146100c45780637ccb6a64146100f45780638c2840cc14610129578063ea4fc92d14610159575b5f80fd5b61007e60048036038101906100799190610e08565b610189565b60405161008b9190610ec6565b60405180910390f35b6100ae60048036038101906100a99190610edf565b6103d9565b6040516100bb9190610ec6565b60405180910390f35b6100de60048036038101906100d99190610fb3565b610705565b6040516100eb919061111e565b60405180910390f35b61010e60048036038101906101099190610edf565b610957565b604051610120969594939291906111a4565b60405180910390f35b610143600480360381019061013e9190610edf565b610be5565b6040516101509190610ec6565b60405180910390f35b610173600480360381019061016e9190611218565b610c1a565b6040516101809190611243565b60405180910390f35b5f80826040516101999190611296565b90815260200160405180910390206005015f9054906101000a900460ff16156101f7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ee906112f6565b60405180910390fd5b5f6040518060c001604052808681526020018581526020018481526020013373ffffffffffffffffffffffffffffffffffffffff168152602001428152602001600115158152509050805f846040516102509190611296565b90815260200160405180910390205f820151815f019081610271919061150e565b506020820151816001019081610287919061150e565b50604082015181600201908161029d919061150e565b506060820151816003015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506080820151816004015560a0820151816005015f6101000a81548160ff02191690831515021790555090505060015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2083908060018154018082558091505060019003905f5260205f20015f90919091909150908161037c919061150e565b503373ffffffffffffffffffffffffffffffffffffffff167f9e96b0e7627747bba4f711879b55bf1fa8a10042d49bbaf1dc1a54656ff4a96684426040516103c59291906115dd565b60405180910390a260019150509392505050565b5f80826040516103e99190611296565b90815260200160405180910390206005015f9054906101000a900460ff16610446576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043d90611655565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff165f8360405161046c9190611296565b90815260200160405180910390206003015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146104f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ea906116e3565b60405180910390fd5b5f60015f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2090505f805f5b838054905081101561059957858051906020012084828154811061055e5761055d611701565b5b905f5260205f200160405161057391906117ca565b60405180910390200361058c5780925060019150610599565b8080600101915050610537565b50806105da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105d190611850565b60405180910390fd5b600183805490506105eb919061189b565b821015610646578260018480549050610604919061189b565b8154811061061557610614611701565b5b905f5260205f20018383815481106106305761062f611701565b5b905f5260205f2001908161064491906118f5565b505b82805480610657576106566119da565b5b600190038181905f5260205f20015f6106709190610c63565b90555f80866040516106829190611296565b90815260200160405180910390206005015f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167ffe4ffc9e67862a9b44e3fe906ce7832f5379a814e02ca0c6423ed3d1944a6a4a86426040516106f19291906115dd565b60405180910390a260019350505050919050565b60605f60015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20805480602002602001604051908101604052809291908181526020015f905b8282101561080c578382905f5260205f2001805461078190611341565b80601f01602080910402602001604051908101604052809291908181526020018280546107ad90611341565b80156107f85780601f106107cf576101008083540402835291602001916107f8565b820191905f5260205f20905b8154815290600101906020018083116107db57829003601f168201915b505050505081526020019060010190610764565b5050505090505f81519050808510610875575f67ffffffffffffffff81111561083857610837610ce4565b5b60405190808252806020026020018201604052801561086b57816020015b60608152602001906001900390816108565790505b5092505050610950565b5f8490508185876108869190611a07565b111561089b578582610898919061189b565b90505b5f8167ffffffffffffffff8111156108b6576108b5610ce4565b5b6040519080825280602002602001820160405280156108e957816020015b60608152602001906001900390816108d45790505b5090505f5b82811015610947578481896109039190611a07565b8151811061091457610913611701565b5b602002602001015182828151811061092f5761092e611701565b5b602002602001018190525080806001019150506108ee565b50809450505050505b9392505050565b60608060605f805f805f8860405161096f9190611296565b90815260200160405180910390206040518060c00160405290815f8201805461099790611341565b80601f01602080910402602001604051908101604052809291908181526020018280546109c390611341565b8015610a0e5780601f106109e557610100808354040283529160200191610a0e565b820191905f5260205f20905b8154815290600101906020018083116109f157829003601f168201915b50505050508152602001600182018054610a2790611341565b80601f0160208091040260200160405190810160405280929190818152602001828054610a5390611341565b8015610a9e5780601f10610a7557610100808354040283529160200191610a9e565b820191905f5260205f20905b815481529060010190602001808311610a8157829003601f168201915b50505050508152602001600282018054610ab790611341565b80601f0160208091040260200160405190810160405280929190818152602001828054610ae390611341565b8015610b2e5780601f10610b0557610100808354040283529160200191610b2e565b820191905f5260205f20905b815481529060010190602001808311610b1157829003601f168201915b50505050508152602001600382015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200160048201548152602001600582015f9054906101000a900460ff1615151515815250509050805f015181602001518260400151836060015184608001518560a001519650965096509650965096505091939550919395565b5f8082604051610bf59190611296565b90815260200160405180910390206005015f9054906101000a900460ff169050919050565b5f60015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20805490509050919050565b508054610c6f90611341565b5f825580601f10610c805750610c9d565b601f0160209004905f5260205f2090810190610c9c9190610ca0565b5b50565b5b80821115610cb7575f815f905550600101610ca1565b5090565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b610d1a82610cd4565b810181811067ffffffffffffffff82111715610d3957610d38610ce4565b5b80604052505050565b5f610d4b610cbb565b9050610d578282610d11565b919050565b5f67ffffffffffffffff821115610d7657610d75610ce4565b5b610d7f82610cd4565b9050602081019050919050565b828183375f83830152505050565b5f610dac610da784610d5c565b610d42565b905082815260208101848484011115610dc857610dc7610cd0565b5b610dd3848285610d8c565b509392505050565b5f82601f830112610def57610dee610ccc565b5b8135610dff848260208601610d9a565b91505092915050565b5f805f60608486031215610e1f57610e1e610cc4565b5b5f84013567ffffffffffffffff811115610e3c57610e3b610cc8565b5b610e4886828701610ddb565b935050602084013567ffffffffffffffff811115610e6957610e68610cc8565b5b610e7586828701610ddb565b925050604084013567ffffffffffffffff811115610e9657610e95610cc8565b5b610ea286828701610ddb565b9150509250925092565b5f8115159050919050565b610ec081610eac565b82525050565b5f602082019050610ed95f830184610eb7565b92915050565b5f60208284031215610ef457610ef3610cc4565b5b5f82013567ffffffffffffffff811115610f1157610f10610cc8565b5b610f1d84828501610ddb565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610f4f82610f26565b9050919050565b610f5f81610f45565b8114610f69575f80fd5b50565b5f81359050610f7a81610f56565b92915050565b5f819050919050565b610f9281610f80565b8114610f9c575f80fd5b50565b5f81359050610fad81610f89565b92915050565b5f805f60608486031215610fca57610fc9610cc4565b5b5f610fd786828701610f6c565b9350506020610fe886828701610f9f565b9250506040610ff986828701610f9f565b9150509250925092565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f61105e8261102c565b6110688185611036565b9350611078818560208601611046565b61108181610cd4565b840191505092915050565b5f6110978383611054565b905092915050565b5f602082019050919050565b5f6110b582611003565b6110bf818561100d565b9350836020820285016110d18561101d565b805f5b8581101561110c57848403895281516110ed858261108c565b94506110f88361109f565b925060208a019950506001810190506110d4565b50829750879550505050505092915050565b5f6020820190508181035f83015261113681846110ab565b905092915050565b5f82825260208201905092915050565b5f6111588261102c565b611162818561113e565b9350611172818560208601611046565b61117b81610cd4565b840191505092915050565b61118f81610f45565b82525050565b61119e81610f80565b82525050565b5f60c0820190508181035f8301526111bc818961114e565b905081810360208301526111d0818861114e565b905081810360408301526111e4818761114e565b90506111f36060830186611186565b6112006080830185611195565b61120d60a0830184610eb7565b979650505050505050565b5f6020828403121561122d5761122c610cc4565b5b5f61123a84828501610f6c565b91505092915050565b5f6020820190506112565f830184611195565b92915050565b5f81905092915050565b5f6112708261102c565b61127a818561125c565b935061128a818560208601611046565b80840191505092915050565b5f6112a18284611266565b915081905092915050565b7f446f63756d656e7420616c7265616479207265676973746572656400000000005f82015250565b5f6112e0601b8361113e565b91506112eb826112ac565b602082019050919050565b5f6020820190508181035f83015261130d816112d4565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061135857607f821691505b60208210810361136b5761136a611314565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026113cd7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82611392565b6113d78683611392565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61141261140d61140884610f80565b6113ef565b610f80565b9050919050565b5f819050919050565b61142b836113f8565b61143f61143782611419565b84845461139e565b825550505050565b5f90565b611453611447565b61145e818484611422565b505050565b5b81811015611481576114765f8261144b565b600181019050611464565b5050565b601f8211156114c65761149781611371565b6114a084611383565b810160208510156114af578190505b6114c36114bb85611383565b830182611463565b50505b505050565b5f82821c905092915050565b5f6114e65f19846008026114cb565b1980831691505092915050565b5f6114fe83836114d7565b9150826002028217905092915050565b6115178261102c565b67ffffffffffffffff8111156115305761152f610ce4565b5b61153a8254611341565b611545828285611485565b5f60209050601f831160018114611576575f8415611564578287015190505b61156e85826114f3565b8655506115d5565b601f19841661158486611371565b5f5b828110156115ab57848901518255600182019150602085019450602081019050611586565b868310156115c857848901516115c4601f8916826114d7565b8355505b6001600288020188555050505b505050505050565b5f6040820190508181035f8301526115f5818561114e565b90506116046020830184611195565b9392505050565b7f446f63756d656e7420646f6573206e6f742065786973740000000000000000005f82015250565b5f61163f60178361113e565b915061164a8261160b565b602082019050919050565b5f6020820190508181035f83015261166c81611633565b9050919050565b7f4f6e6c792074686520646f63756d656e74206f776e65722063616e2064656c655f8201527f7465206974000000000000000000000000000000000000000000000000000000602082015250565b5f6116cd60258361113e565b91506116d882611673565b604082019050919050565b5f6020820190508181035f8301526116fa816116c1565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b5f81905092915050565b5f819050815f5260205f209050919050565b5f815461175681611341565b611760818661172e565b9450600182165f811461177a576001811461178f576117c1565b60ff19831686528115158202860193506117c1565b61179885611738565b5f5b838110156117b95781548189015260018201915060208101905061179a565b838801955050505b50505092915050565b5f6117d5828461174a565b915081905092915050565b7f446f63756d656e742068617368206e6f7420666f756e6420696e206f776e65725f8201527f277320646f63756d656e74730000000000000000000000000000000000000000602082015250565b5f61183a602c8361113e565b9150611845826117e0565b604082019050919050565b5f6020820190508181035f8301526118678161182e565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6118a582610f80565b91506118b083610f80565b92508282039050818111156118c8576118c761186e565b5b92915050565b5f815490506118dc81611341565b9050919050565b5f819050815f5260205f209050919050565b8181036119035750506119d8565b61190c826118ce565b67ffffffffffffffff81111561192557611924610ce4565b5b61192f8254611341565b61193a828285611485565b5f601f831160018114611967575f8415611955578287015490505b61195f85826114f3565b8655506119d1565b601f198416611975876118e3565b965061198086611371565b5f5b828110156119a757848901548255600182019150600185019450602081019050611982565b868310156119c457848901546119c0601f8916826114d7565b8355505b6001600288020188555050505b5050505050505b565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603160045260245ffd5b5f611a1182610f80565b9150611a1c83610f80565b9250828201905080821115611a3457611a3361186e565b5b9291505056fea26469706673582212209182e95bc99c9dd2ced9ac16ff15e620c714d5087cc4bc0b6c086de57693d66564736f6c634300081a0033';

// Contract address (will be filled after deployment)
let contractAddress = localStorage.getItem('contractAddress') || '0x7809C518cf8a0496361Fea06750601db707Acd5D';

// Network configuration
const networks = {
    // Ethereum mainnet
    1: {
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/19617f6e06dc4679acfcc078de838ac3', // Replace with your Infura project ID
        blockExplorer: 'https://etherscan.io'
    },
    // Goerli testnet
    5: {
        name: 'Goerli Testnet',
        rpcUrl: 'https://goerli.infura.io/v3/19617f6e06dc4679acfcc078de838ac3', // Replace with your Infura project ID
        blockExplorer: 'https://goerli.etherscan.io'
    },
    // Sepolia testnet
    11155111: {
        name: 'Sepolia Testnet',
        rpcUrl: 'https://sepolia.infura.io/v3/19617f6e06dc4679acfcc078de838ac3', // Replace with your Infura project ID
        blockExplorer: 'https://sepolia.etherscan.io'
    },
    // Polygon (Matic) Mainnet
    137: {
        name: 'Polygon Mainnet',
        rpcUrl: 'https://polygon-rpc.com',
        blockExplorer: 'https://polygonscan.com'
    },
    // Mumbai testnet
    80001: {
        name: 'Mumbai Testnet',
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        blockExplorer: 'https://mumbai.polygonscan.com'
    }
};

// Web3 instance
let web3;
let docVerifyContract;
let currentAccount = null;
let currentChainId = null;

// Initialize web3 when the page loads
window.addEventListener('load', async function() {
    await initWeb3();
    // Check if user was previously logged in
    checkLogin();
    // Verify contract if address exists
    if (contractAddress) {
        verifyContract();
    }
});

// Verify if contract is valid and has the expected functions
async function verifyContract() {
    try {
        if (!docVerifyContract) {
            docVerifyContract = new web3.eth.Contract(contractABI, contractAddress);
        }
        
        // Check if contract exists at the specified address
        const code = await web3.eth.getCode(contractAddress);
        if (code === '0x' || code === '0x0') {
            console.error("No contract found at the specified address");
            contractAddress = null;
            localStorage.removeItem('contractAddress');
            return false;
        }
        
        // Verify basic contract functions exist
        try {
            // Check if the isDocumentRegistered function exists and is callable
            await docVerifyContract.methods.isDocumentRegistered("test").call();
            return true;
        } catch (error) {
            if (error.message.includes("execution reverted")) {
                // This is actually good - it means the function exists but the test hash doesn't exist
                return true;
            } else {
                console.error("Contract verification failed:", error);
                contractAddress = null;
                localStorage.removeItem('contractAddress');
                return false;
            }
        }
    } catch (error) {
        console.error("Contract verification error:", error);
        contractAddress = null;
        localStorage.removeItem('contractAddress');
        return false;
    }
}

// Initialize Web3
async function initWeb3() {
    console.log("Initializing Web3...");
    
    // Check for stored contract address
    contractAddress = localStorage.getItem('contractAddress');
    console.log("Loaded contract address from localStorage:", contractAddress);
    
    // Modern dapp browsers
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Get current chain ID
            currentChainId = await web3.eth.getChainId();
            console.log("Connected to chain ID:", currentChainId);
            
            // Listen for chain changes
            window.ethereum.on('chainChanged', handleChainChanged);
            
            // Initialize the contract if address exists
            if (contractAddress) {
                console.log("Initializing contract with address:", contractAddress);
                docVerifyContract = new web3.eth.Contract(contractABI, contractAddress);
                console.log("Contract initialized successfully");
            } else {
                console.log("No contract address found in localStorage");
            }
            return true;
        } catch (error) {
            console.error("Error initializing Web3:", error);
            showError("Error initializing blockchain connection. Please refresh and try again.");
            return false;
        }
    } 
    // Legacy dapp browsers
    else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        return true;
    } 
    // No web3 provider
    else {
        showError("No Ethereum browser extension detected. Please install MetaMask to use this application.");
        return false;
    }
}

// Check if MetaMask is installed
async function checkMetaMaskInstalled() {
    if (window.ethereum) {
        return await initWeb3();
    } else {
        showError("MetaMask is not installed. Please install MetaMask to use this application.");
        return false;
    }
}

// Connect to MetaMask
async function connectWallet() {
    if (!(await checkMetaMaskInstalled())) return false;
    
    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        
        // Save the account in localStorage
        localStorage.setItem('currentAccount', currentAccount);
        
        // Display account info
        const accountAddressElement = document.getElementById('account-address');
        if (accountAddressElement) {
            accountAddressElement.textContent = shortenAddress(currentAccount);
        }
        
        // Show account details
        const accountDetailsElement = document.getElementById('account-details');
        if (accountDetailsElement) {
            accountDetailsElement.classList.remove('d-none');
        }
        
        // Setup MetaMask events
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        // Check if on a supported network
        await checkNetwork();
        
        // Check if contract is deployed
        if (!contractAddress) {
            // Show deploy button on index page if admin
            const deploySection = document.getElementById('deploy-section');
            if (deploySection) {
                deploySection.classList.remove('d-none');
                document.getElementById('deploy-contract-btn').addEventListener('click', deployContract);
            }
        }
        
        return true;
    } catch (error) {
        console.error("User denied account access", error);
        showError("Failed to connect wallet. Please try again.");
        return false;
    }
}

// Check if the current network is supported
async function checkNetwork() {
    try {
        // Get the current chain ID
        const chainId = await web3.eth.getChainId();
        currentChainId = chainId;
        
        // Check if chain is supported
        if (!networks[chainId]) {
            showError(`Network not supported. Please switch to a supported network in MetaMask.`);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error checking network:", error);
        showError("Error checking network. Please try again.");
        return false;
    }
}

// Handle chain changed event
function handleChainChanged(chainId) {
    // Reload the page to avoid any state issues
    window.location.reload();
}

// Deploy contract function
async function deployContract() {
    try {
        // First check network
        if (!(await checkNetwork())) {
            return false;
        }
        
        const deployStatus = document.getElementById('deploy-status');
        deployStatus.textContent = 'Deploying contract...';
        deployStatus.className = 'alert alert-info mt-3';
        deployStatus.classList.remove('d-none');
        
        // Create contract instance
        const DocVerificationContract = new web3.eth.Contract(contractABI);
        
        // Deploy contract
        const deployTx = DocVerificationContract.deploy({
            data: contractBytecode,
            arguments: []
        });
        
        // Estimate gas
        const gas = await deployTx.estimateGas({ from: currentAccount });
        
        // Send transaction
        const deployedContract = await deployTx.send({
            from: currentAccount,
            gas
        });
        
        // Save contract address
        contractAddress = deployedContract.options.address;
        localStorage.setItem('contractAddress', contractAddress);
        
        // Initialize contract
        docVerifyContract = deployedContract;
        
        deployStatus.textContent = 'Contract deployed successfully! Address: ' + contractAddress;
        deployStatus.className = 'alert alert-success mt-3';
        
        // Hide deploy button and show proceed button
        document.getElementById('deploy-contract-btn').classList.add('d-none');
        const proceedBtn = document.getElementById('proceed-btn');
        if (proceedBtn) {
            proceedBtn.classList.remove('d-none');
        }
        
        return true;
    } catch (error) {
        console.error('Error deploying contract:', error);
        const deployStatus = document.getElementById('deploy-status');
        deployStatus.textContent = 'Error: ' + (error.message || 'Failed to deploy contract');
        deployStatus.className = 'alert alert-danger mt-3';
        return false;
    }
}

// Handle account change
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected their wallet
        logout();
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        localStorage.setItem('currentAccount', currentAccount);
        
        // Update UI
        const accountAddressElement = document.getElementById('account-address');
        if (accountAddressElement) {
            accountAddressElement.textContent = shortenAddress(currentAccount);
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentAccount');
    currentAccount = null;
    
    // Update UI to show login button
    const accountDetailsElement = document.getElementById('account-details');
    if (accountDetailsElement) {
        accountDetailsElement.classList.add('d-none');
    }
}

// Check if user is logged in
function checkLogin() {
    const savedAccount = localStorage.getItem('currentAccount');
    if (savedAccount) {
        currentAccount = savedAccount;
        connectWallet(); // Re-establish connection
        
        // Enable proceed button if contract is already deployed
        if (contractAddress) {
            const proceedBtn = document.getElementById('proceed-btn');
            if (proceedBtn) {
                proceedBtn.classList.remove('d-none');
            }
        }
    }
}

// Helper to shorten address for display
function shortenAddress(address) {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4);
}

// Calculate SHA-256 hash of a file
async function calculateFileHash(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                resolve(hashHex);
            } catch (error) {
                console.error("Error calculating file hash:", error);
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('d-none');
        }, 5000);
    } else {
        alert(message);
    }
}

// Make functions globally available
window.connectWallet = connectWallet;
window.checkLogin = checkLogin;
window.calculateFileHash = calculateFileHash;
window.logout = logout;

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const connectWalletBtn = document.getElementById('connect-wallet');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }
    
    const proceedBtn = document.getElementById('proceed-btn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
});
