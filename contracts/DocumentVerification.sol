// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {
    struct Document {
        string title;
        string description;
        string documentHash;
        address owner;
        uint256 timestamp;
        bool exists;
    }
    
    // Mapping from document hash to Document struct
    mapping(string => Document) private documents;
    
    // Mapping from owner to their document hashes
    mapping(address => string[]) private ownerDocuments;
    
    // Event emitted when a document is registered
    event DocumentRegistered(address indexed owner, string documentHash, uint256 timestamp);
    
    // Event emitted when a document is deleted
    event DocumentDeleted(address indexed owner, string documentHash, uint256 timestamp);
    
    constructor() {
        // Initialization if needed
    }
    
    // Register a new document
    function registerDocument(string memory _title, string memory _description, string memory _documentHash) public returns (bool) {
        // Check if document already exists
        require(!documents[_documentHash].exists, "Document already registered");
        
        // Create new document
        Document memory newDocument = Document({
            title: _title,
            description: _description,
            documentHash: _documentHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        // Store document
        documents[_documentHash] = newDocument;
        
        // Add to owner's documents
        ownerDocuments[msg.sender].push(_documentHash);
        
        // Emit event
        emit DocumentRegistered(msg.sender, _documentHash, block.timestamp);
        
        return true;
    }
    
    // Check if document is registered
    function isDocumentRegistered(string memory _documentHash) public view returns (bool) {
        return documents[_documentHash].exists;
    }
    
    // Get document by hash
    function getDocument(string memory _documentHash) public view returns (
        string memory title,
        string memory description,
        string memory documentHash,
        address owner,
        uint256 timestamp,
        bool exists
    ) {
        Document memory doc = documents[_documentHash];
        return (
            doc.title,
            doc.description,
            doc.documentHash,
            doc.owner,
            doc.timestamp,
            doc.exists
        );
    }
    
    // Get all documents by owner (with pagination to avoid gas limits)
    function getDocumentsByOwner(address _owner, uint256 startIndex, uint256 count) public view returns (string[] memory) {
        string[] memory ownerDocs = ownerDocuments[_owner];
        uint256 totalDocs = ownerDocs.length;
        
        // Validate inputs
        if (startIndex >= totalDocs) {
            return new string[](0);
        }
        
        // Calculate actual count (don't exceed array bounds)
        uint256 actualCount = count;
        if (startIndex + count > totalDocs) {
            actualCount = totalDocs - startIndex;
        }
        
        // Create result array
        string[] memory result = new string[](actualCount);
        for (uint256 i = 0; i < actualCount; i++) {
            result[i] = ownerDocs[startIndex + i];
        }
        
        return result;
    }
    
    // Get total number of documents for an owner
    function getDocumentCountByOwner(address _owner) public view returns (uint256) {
        return ownerDocuments[_owner].length;
    }
    
    // Delete a document (only the owner can delete their documents)
    function deleteDocument(string memory _documentHash) public returns (bool) {
        // Check if document exists
        require(documents[_documentHash].exists, "Document does not exist");
        
        // Check if sender is the owner
        require(documents[_documentHash].owner == msg.sender, "Only the document owner can delete it");
        
        // Get owner documents array
        string[] storage ownerDocs = ownerDocuments[msg.sender];
        
        // Find the index of the document hash in the owner's array
        uint256 indexToDelete = 0;
        bool found = false;
        
        for (uint256 i = 0; i < ownerDocs.length; i++) {
            if (keccak256(bytes(ownerDocs[i])) == keccak256(bytes(_documentHash))) {
                indexToDelete = i;
                found = true;
                break;
            }
        }
        
        // If the document hash is found in the owner's array
        require(found, "Document hash not found in owner's documents");
        
        // Remove document from the owner's array by replacing it with the last element and then removing the last element
        if (indexToDelete < ownerDocs.length - 1) {
            ownerDocs[indexToDelete] = ownerDocs[ownerDocs.length - 1];
        }
        ownerDocs.pop();
        
        // Mark document as deleted
        documents[_documentHash].exists = false;
        
        // Emit event for document deletion
        emit DocumentDeleted(msg.sender, _documentHash, block.timestamp);
        
        return true;
    }
}