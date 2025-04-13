// app.js - Main application logic

document.addEventListener('DOMContentLoaded', async function() {
    // Check the page we're on
    const currentPage = window.location.pathname.split('/').pop();
    
    // Default page is index.html
    if (currentPage === '' || currentPage === 'index.html') {
        initLoginPage();
    } else if (currentPage === 'dashboard.html') {
        // Use the checkLogin function from web3.js
        await window.checkLogin();
        initDashboardPage();
    } else if (currentPage === 'verify.html') {
        initVerifyPage();
    }
});

// Initialize the login page
function initLoginPage() {
    // Note: Main connect button event listener is now set in web3.js
    // here we're just adding any additional functionality
    
    // Check if user is already logged in - done in web3.js now
    const accountDisplay = document.getElementById('account-address');
    if (accountDisplay && currentAccount) {
        accountDisplay.textContent = shortenAddress(currentAccount);
    }
}

// Initialize the dashboard page
async function initDashboardPage() {
    console.log("Initializing dashboard page...");
    
    // Make sure we have a web3 instance
    if (!web3) {
        console.log("Web3 not initialized, attempting to initialize...");
        await initWeb3();
    }
    
    // Make sure we're connected to MetaMask
    if (!currentAccount) {
        console.log("No account connected, prompting user to connect...");
        await connectWallet();
    }
    
    // Display account address in the header
    const accountDisplay = document.getElementById('account-display');
    if (accountDisplay && currentAccount) {
        accountDisplay.textContent = shortenAddress(currentAccount);
    }
    
    // Make sure contract is initialized
    if (!docVerifyContract || !docVerifyContract.methods) {
        console.log("Contract not initialized, checking for saved address...");
        if (contractAddress) {
            console.log("Initializing contract with saved address:", contractAddress);
            docVerifyContract = new web3.eth.Contract(contractABI, contractAddress);
        } else {
            console.warn("No contract address found, user needs to deploy a contract");
            // Show deploy button if it exists
            const deployBtn = document.getElementById('deploy-contract-btn');
            if (deployBtn) {
                deployBtn.classList.remove('d-none');
            }
        }
    }
    
    // Set up document upload form
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleDocumentUpload);
    }
    
    console.log("Loading user documents...");
    // Load user's documents
    await loadUserDocuments();
}

// Initialize the verify page
function initVerifyPage() {
    // Display account address if logged in
    const userAddress = document.getElementById('user-address');
    if (userAddress && currentAccount) {
        userAddress.textContent = shortenAddress(currentAccount);
    }
    
    // Set up verify by hash button
    const verifyHashBtn = document.getElementById('verify-hash-btn');
    if (verifyHashBtn) {
        verifyHashBtn.addEventListener('click', handleVerifyByHash);
    }
    
    // Set up verify by file button
    const verifyFileBtn = document.getElementById('verify-file-btn');
    if (verifyFileBtn) {
        verifyFileBtn.addEventListener('click', handleVerifyByFile);
    }
    
    // Set up certificate view button
    const viewCertificateBtn = document.getElementById('view-certificate-btn');
    if (viewCertificateBtn) {
        viewCertificateBtn.addEventListener('click', function() {
            const documentHash = document.getElementById('detail-hash').textContent;
            if (documentHash) {
                generateCertificateFromHash(documentHash);
            }
        });
    }
    
    // Check for hash in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hashParam = urlParams.get('hash');
    if (hashParam) {
        // Set the hash in the input field
        const hashInput = document.getElementById('document-hash');
        if (hashInput) {
            hashInput.value = hashParam;
            // Trigger verification
            setTimeout(() => {
                verifyHashBtn.click();
            }, 500);
        }
    }
}

// Handle document upload
async function handleDocumentUpload(event) {
    event.preventDefault();
    
    const titleInput = document.getElementById('document-title');
    const descriptionInput = document.getElementById('document-description');
    const fileInput = document.getElementById('document-file');
    const uploadStatus = document.getElementById('upload-status');
    
    // Basic validation
    if (!titleInput.value.trim() || !fileInput.files[0]) {
        uploadStatus.textContent = 'Please provide a title and select a file.';
        uploadStatus.className = 'alert alert-danger mt-3';
        uploadStatus.classList.remove('d-none');
        return;
    }
    
    try {
        uploadStatus.textContent = 'Calculating document hash...';
        uploadStatus.className = 'alert alert-info mt-3';
        uploadStatus.classList.remove('d-none');
        
        // Make sure contract is initialized
        if (!docVerifyContract || !docVerifyContract.methods) {
            // Try to initialize contract if the address exists
            if (contractAddress) {
                docVerifyContract = new web3.eth.Contract(contractABI, contractAddress);
            } else {
                uploadStatus.textContent = 'Contract not deployed or not connected. Please deploy the contract first.';
                uploadStatus.className = 'alert alert-danger mt-3';
                return;
            }
        }
        
        // Calculate file hash
        const documentHash = await calculateFileHash(fileInput.files[0]);
        
        // Check if document already exists
        const isRegistered = await docVerifyContract.methods.isDocumentRegistered(documentHash).call();
        
        if (isRegistered) {
            uploadStatus.textContent = 'This document is already registered on the blockchain.';
            uploadStatus.className = 'alert alert-warning mt-3';
            return;
        }
        
        uploadStatus.textContent = 'Registering document on blockchain...';
        
        // Register document on blockchain
        await docVerifyContract.methods.registerDocument(
            titleInput.value.trim(),
            descriptionInput.value.trim(),
            documentHash
        ).send({ from: currentAccount });
        
        uploadStatus.textContent = 'Document successfully registered on the blockchain!';
        uploadStatus.className = 'alert alert-success mt-3';
        
        // Reset form
        event.target.reset();
        
        // Reload documents
        setTimeout(() => {
            loadUserDocuments();
        }, 2000);
        
    } catch (error) {
        console.error('Error uploading document:', error);
        uploadStatus.textContent = 'Error: ' + (error.message || 'Failed to register document');
        uploadStatus.className = 'alert alert-danger mt-3';
    }
}

// Load user's documents
async function loadUserDocuments() {
    const documentsTableBody = document.getElementById('documents-table-body');
    const loadingElement = document.getElementById('my-documents-loading');
    const documentsListElement = document.getElementById('my-documents-list');
    const noDocumentsElement = document.getElementById('no-documents');
    
    if (!documentsTableBody) return;
    
    try {
        // Show loading
        loadingElement.classList.remove('d-none');
        documentsListElement.classList.add('d-none');
        documentsTableBody.innerHTML = '';
        
        // Make sure contract is initialized
        if (!docVerifyContract || !docVerifyContract.methods) {
            // Try to initialize contract if the address exists
            if (contractAddress) {
                console.log("Reinitializing contract with address:", contractAddress);
                docVerifyContract = new web3.eth.Contract(contractABI, contractAddress);
            } else {
                // Show error message
                loadingElement.classList.add('d-none');
                const errorElement = document.createElement('div');
                errorElement.className = 'alert alert-danger';
                errorElement.textContent = 'Contract not deployed or not connected. Please deploy the contract first.';
                documentsTableBody.parentElement.appendChild(errorElement);
                return;
            }
        }
        
        // Make sure we have an account
        if (!currentAccount) {
            loadingElement.classList.add('d-none');
            const errorElement = document.createElement('div');
            errorElement.className = 'alert alert-warning';
            errorElement.textContent = 'Please connect your wallet to view your documents.';
            documentsTableBody.parentElement.appendChild(errorElement);
            return;
        }
        
        console.log("Fetching documents for account:", currentAccount);
        
        // Get document count first
        const count = await docVerifyContract.methods.getDocumentCountByOwner(currentAccount).call();
        console.log("Document count:", count);
        
        if (parseInt(count) === 0) {
            loadingElement.classList.add('d-none');
            documentsListElement.classList.remove('d-none');
            noDocumentsElement.classList.remove('d-none');
            return;
        }
        
        // Get documents from contract (paginated if count is large)
        const batchSize = 10;
        let startIndex = 0;
        let documents = [];
        
        while (startIndex < count) {
            console.log(`Fetching documents batch from ${startIndex} to ${Math.min(startIndex + batchSize, count)}`);
            const batchDocuments = await docVerifyContract.methods.getDocumentsByOwner(
                currentAccount, 
                startIndex, 
                Math.min(batchSize, count - startIndex)
            ).call();
            
            console.log("Batch documents:", batchDocuments);
            documents = documents.concat(batchDocuments);
            startIndex += batchSize;
        }
        
        // Hide loading, show results
        loadingElement.classList.add('d-none');
        documentsListElement.classList.remove('d-none');
        
        if (documents.length === 0) {
            noDocumentsElement.classList.remove('d-none');
            return;
        } else {
            noDocumentsElement.classList.add('d-none');
        }
        
        console.log("Total documents fetched:", documents.length);
        
        // Fetch and display each document
        for (const hash of documents) {
            console.log("Fetching details for document hash:", hash);
            // Get document details from contract
            const document = await docVerifyContract.methods.getDocument(hash).call();
            console.log("Document details:", document);
            // Create row in table
            const row = createDocumentRow(document);
            documentsTableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        if (loadingElement) loadingElement.classList.add('d-none');
        
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger';
        errorElement.textContent = 'Error loading documents: ' + (error.message || 'Unknown error');
        documentsTableBody.parentElement.appendChild(errorElement);
    }
}

// Create document row for table display
function createDocumentRow(doc) {
    // Create row
    const row = document.createElement('tr');
    
    // Convert timestamp to readable date
    const date = new Date(doc.timestamp * 1000);
    const dateString = date.toLocaleString();
    
    // Create cells
    const titleCell = document.createElement('td');
    titleCell.textContent = doc.title;
    
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = doc.description.length > 50 
        ? doc.description.substring(0, 50) + '...' 
        : doc.description;
    
    const dateCell = document.createElement('td');
    dateCell.textContent = dateString;
    
    const hashCell = document.createElement('td');
    const hashText = doc.documentHash.substring(0, 8) + '...' + doc.documentHash.substring(doc.documentHash.length - 8);
    hashCell.textContent = hashText;
    
    const actionsCell = document.createElement('td');
    
    // Create verify button
    const verifyBtn = document.createElement('button');
    verifyBtn.className = 'btn btn-sm btn-primary me-2';
    verifyBtn.innerHTML = '<i class="bi bi-check-circle"></i> Verify';
    verifyBtn.addEventListener('click', () => {
        window.location.href = `verify.html?hash=${doc.documentHash}`;
    });
    
    // Create certificate button
    const certificateBtn = document.createElement('button');
    certificateBtn.className = 'btn btn-sm btn-success me-2';
    certificateBtn.innerHTML = '<i class="bi bi-award"></i> Certificate';
    certificateBtn.addEventListener('click', () => {
        generateCertificateFromHash(doc.documentHash);
    });
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-danger';
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Delete';
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            deleteDocument(doc.documentHash);
        }
    });
    
    // Add buttons to actions cell
    actionsCell.appendChild(verifyBtn);
    actionsCell.appendChild(certificateBtn);
    actionsCell.appendChild(deleteBtn);
    
    // Add cells to row
    row.appendChild(titleCell);
    row.appendChild(descriptionCell);
    row.appendChild(dateCell);
    row.appendChild(hashCell);
    row.appendChild(actionsCell);
    
    return row;
}

// Delete document function
async function deleteDocument(documentHash) {
    try {
        showLoading('Deleting document...');
        
        // Direct check for ethereum provider
        if (!window.ethereum) {
            hideLoading();
            showError('MetaMask not detected. Please install MetaMask to use this feature.');
            return;
        }
        
        // Get accounts directly from MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            hideLoading();
            showError('Please connect your MetaMask wallet to continue.');
            return;
        }
        
        // Get contract address from localStorage
        const contractAddr = localStorage.getItem('contractAddress');
        if (!contractAddr) {
            hideLoading();
            showError('Contract address not found. Please deploy the contract first.');
            return;
        }
        
        // Create web3 instance directly
        const web3Instance = new Web3(window.ethereum);
        
        // Create contract instance with the full ABI
        const contract = new web3Instance.eth.Contract(contractABI, contractAddr);
        
        // Add logging
        console.log('Deleting document with hash:', documentHash);
        console.log('Using account:', accounts[0]);
        
        // Call deleteDocument with gas parameter
        const tx = await contract.methods.deleteDocument(documentHash).send({
            from: accounts[0],
            gas: 300000
        });
        
        console.log('Transaction result:', tx);
        
        hideLoading();
        showSuccess('Document deleted successfully!');
        
        // Reload user documents after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } catch (error) {
        console.error('Error deleting document:', error);
        hideLoading();
        
        if (error.code === 4001) {
            showError('Transaction was rejected in MetaMask.');
        } else {
            showError('Failed to delete document: ' + error.message);
        }
    }
}
// Verify document by hash directly
async function verifyDocumentByHash(hash) {
    try {
        console.log("Verifying document with hash:", hash);
        
        // Make sure contract is initialized
        if (!docVerifyContract || !docVerifyContract.methods) {
            console.log("Contract not initialized, attempting to reinitialize");
            // Try to initialize contract if the address exists
            if (contractAddress) {
                console.log("Reinitializing contract with address:", contractAddress);
                docVerifyContract = new web3.eth.Contract(contractABI, contractAddress);
            } else {
                console.error("No contract address found");
                return { verified: false, error: 'Contract not deployed or not connected. Please deploy the contract first.' };
            }
        }
        
        // Check if contract is still not initialized
        if (!docVerifyContract || !docVerifyContract.methods) {
            console.error("Failed to initialize contract");
            return { verified: false, error: 'Failed to initialize contract. Please refresh and try again.' };
        }
        
        console.log("Checking if document is registered");
        // Check if document exists
        const isRegistered = await docVerifyContract.methods.isDocumentRegistered(hash).call();
        console.log("Document registered:", isRegistered);
        
        if (!isRegistered) {
            return { verified: false, error: 'Document not found on the blockchain.' };
        }
        
        console.log("Getting document details");
        // Get document details
        const document = await docVerifyContract.methods.getDocument(hash).call();
        console.log("Retrieved document details:", document);
        return { verified: true, document };
    } catch (error) {
        console.error('Error verifying document:', error);
        return { verified: false, error: 'Error verifying document: ' + error.message };
    }
}

// Generate certificate from hash
async function generateCertificateFromHash(hash) {
    try {
        // Verify document first
        const result = await verifyDocumentByHash(hash);
        
        if (!result.verified) {
            showError(result.error || 'Document could not be verified');
            return;
        }
        
        // Generate certificate
        generateCertificate(result.document);
    } catch (error) {
        console.error('Error generating certificate:', error);
        showError('Failed to generate certificate: ' + error.message);
    }
}

// Generate certificate
function generateCertificate(docData) {
    // Get certificate container or create one if it doesn't exist
    let certificateContainer = document.getElementById('certificate-container');
    
    if (!certificateContainer) {
        certificateContainer = document.createElement('div');
        certificateContainer.id = 'certificate-container';
        certificateContainer.className = 'certificate-container my-4 p-4 border border-success rounded text-center position-relative';
        certificateContainer.style.backgroundColor = '#f8f9fa';
        certificateContainer.style.maxWidth = '800px';
        certificateContainer.style.margin = '0 auto';
        
        // Add certificate to the page
        const verificationResult = document.getElementById('verification-result');
        verificationResult.appendChild(certificateContainer);
        
        // Add download button if it doesn't exist
        if (!document.getElementById('download-certificate-btn')) {
            const downloadBtn = document.createElement('button');
            downloadBtn.id = 'download-certificate-btn';
            downloadBtn.className = 'btn btn-primary mt-3';
            downloadBtn.innerHTML = '<i class="bi bi-download"></i> Download Certificate';
            downloadBtn.addEventListener('click', downloadCertificate);
            verificationResult.appendChild(downloadBtn);
        }
    }
    
    // Format timestamp
    const timestamp = new Date(docData.timestamp * 1000).toLocaleString();
    
    // Generate certificate content
    certificateContainer.innerHTML = `
        <div class="certificate-watermark position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png" 
                 style="opacity: 0.05; width: 60%; max-width: 300px;" alt="Ethereum Logo">
        </div>
        <div class="position-relative">
            <h1 class="certificate-title mb-4" style="color: #3d576b; font-family: 'Georgia', serif;">Certificate of Authenticity</h1>
            <div class="certificate-seal mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png" 
                     style="width: 80px; height: 80px;" alt="Seal">
            </div>
            <p class="mb-1">This document has been verified on the Ethereum blockchain</p>
            <h2 class="certificate-doc-title my-4">${docData.title}</h2>
            <p class="mb-1"><strong>Document Hash:</strong> ${docData.documentHash}</p>
            <p class="mb-1"><strong>Owner:</strong> ${docData.owner}</p>
            <p class="mb-1"><strong>Verified On:</strong> ${timestamp}</p>
            <div class="certificate-qr mt-4 mb-3 d-flex justify-content-center">
                <div id="certificate-qr-code"></div>
            </div>
            <div class="certificate-footer mt-4">
                <p class="mb-0">DocChain Verification System</p>
                <p class="mb-0">Ethereum Smart Contract: ${contractAddress}</p>
            </div>
        </div>
    `;
    
    // Generate QR code for the certificate
    const qrContainer = document.getElementById('certificate-qr-code');
    
    if (qrContainer) {
        // Always load the QR code script directly in the page
        const qrScript = document.createElement('script');
        qrScript.src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js';
        qrScript.onload = function() {
            try {
                console.log("QR code script loaded successfully");
                // Clear container
                qrContainer.innerHTML = '';
                
                // Create verification URL
                const verificationUrl = `${window.location.origin}/verify.html?hash=${docData.documentHash}`;
                
                // Simple implementation without using complex options
                new QRCode(qrContainer, verificationUrl);
                console.log("QR code generated successfully");
            } catch (error) {
                console.error("Failed to generate QR code:", error);
                // Fallback to link
                qrContainer.innerHTML = `<div class="text-center">
                    <a href="${verificationUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
                        Verification Link
                    </a>
                </div>`;
            }
        };
        
        // Handle script loading error
        qrScript.onerror = function() {
            console.error("Failed to load QR code script");
            const verificationUrl = `${window.location.origin}/verify.html?hash=${docData.documentHash}`;
            qrContainer.innerHTML = `<div class="text-center">
                <a href="${verificationUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
                    Verification Link
                </a>
            </div>`;
        };
        
        // Add script to document
        document.head.appendChild(qrScript);
    }
}

// Download certificate as image (using html2canvas)
function downloadCertificate() {
    const certificateContainer = document.getElementById('certificate-container');
    
    if (!certificateContainer) {
        showError('Certificate not found');
        return;
    }
    
    // Check if html2canvas is available
    if (typeof html2canvas !== 'function') {
        // Load html2canvas if not available
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = function() {
            // Call again after loading
            downloadCertificate();
        };
        document.head.appendChild(script);
        return;
    }
    
    // Convert certificate to canvas
    html2canvas(certificateContainer).then(canvas => {
        // Convert canvas to image data URL
        const imageUrl = canvas.toDataURL('image/png');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = 'document-certificate.png';
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }).catch(error => {
        console.error('Error generating certificate image:', error);
        showError('Failed to generate certificate image');
    });
}

// Handle verify by hash button click
async function handleVerifyByHash() {
    const hashInput = document.getElementById('document-hash');
    const hash = hashInput.value.trim();
    
    // Check URL parameters for hash
    if (!hash) {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParam = urlParams.get('hash');
        if (hashParam) {
            hashInput.value = hashParam;
        } else {
            showVerificationResult(false, null, 'Please enter a document hash.');
            return;
        }
    }
    
    const result = document.getElementById('verification-result');
    const resultMessage = document.getElementById('result-message') || document.getElementById('verify-alert');
    
    if (resultMessage) {
        resultMessage.textContent = 'Verifying document...';
        resultMessage.className = 'alert alert-info';
    }
    
    result.classList.remove('d-none');
    
    try {
        const verificationResult = await verifyDocumentByHash(hash || hashParam);
        showVerificationResult(
            verificationResult.verified, 
            verificationResult.document, 
            verificationResult.error
        );
    } catch (error) {
        console.error('Error during verification:', error);
        showVerificationResult(false, null, 'Error: ' + error.message);
    }
}

// Handle verify by file upload
async function handleVerifyByFile() {
    const fileInput = document.getElementById('verify-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showVerificationResult(false, null, 'Please select a file to verify.');
        return;
    }
    
    const result = document.getElementById('verification-result') || document.getElementById('verify-result');
    const resultMessage = document.getElementById('result-message') || document.getElementById('verify-alert');
    
    if (resultMessage) {
        resultMessage.textContent = 'Calculating document hash...';
        resultMessage.className = 'alert alert-info';
    }
    
    result.classList.remove('d-none');
    
    try {
        // Calculate hash
        const hash = await calculateFileHash(file);
        
        resultMessage.textContent = 'Verifying document on blockchain...';
        
        // Verify hash
        const verificationResult = await verifyDocumentByHash(hash);
        showVerificationResult(
            verificationResult.verified, 
            verificationResult.document, 
            verificationResult.error
        );
    } catch (error) {
        console.error('Error during file verification:', error);
        showVerificationResult(false, null, 'Error: ' + error.message);
    }
}

// Show verification result
function showVerificationResult(isVerified, doc, errorMessage = null) {
    const result = document.getElementById('verification-result') || document.getElementById('verify-result');
    const resultMessage = document.getElementById('result-message') || document.getElementById('verify-alert');
    const documentDetails = document.getElementById('document-details');
    
    if (!result || !resultMessage) return;
    
    result.classList.remove('d-none');
    
    if (isVerified) {
        resultMessage.textContent = 'Document verified! This document is registered on the blockchain.';
        resultMessage.className = 'alert alert-success';
        
        // Display document details
        documentDetails.classList.remove('d-none');
        
        document.getElementById('detail-title').textContent = doc.title;
        document.getElementById('detail-description').textContent = doc.description;
        document.getElementById('detail-owner').textContent = shortenAddress(doc.owner);
        document.getElementById('detail-hash').textContent = doc.documentHash;
        
        // Convert timestamp to readable date
        const date = new Date(doc.timestamp * 1000);
        document.getElementById('detail-timestamp').textContent = date.toLocaleString();
        
        // Enable certificate button if available
        const generateCertBtn = document.getElementById('generate-certificate-btn');
        if (generateCertBtn) {
            generateCertBtn.classList.remove('d-none');
        }
    } else {
        resultMessage.textContent = errorMessage || 'Document not verified! This document is not registered on the blockchain.';
        resultMessage.className = 'alert alert-danger';
        
        if (documentDetails) {
            documentDetails.classList.add('d-none');
        }
    }
}