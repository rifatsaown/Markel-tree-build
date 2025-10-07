// Import the hash function from our utilities module
const { hashData } = require('./utils');

/**
 * Builds a Merkle Tree from an array of data blocks
 *
 * A Merkle Tree is a binary tree where:
 * - Leaf nodes contain hashes of data blocks
 * - Parent nodes contain hashes of their children's combined hashes
 * - The root represents a single hash summarizing all data
 *
 * @param {string[]} dataBlocks - Array of data blocks to build the tree from
 * @returns {Object} - Object containing the root node and all levels of the tree
 */
function buildMerkleTree(dataBlocks) {
  // Handle edge case: empty input returns null root
  if (!dataBlocks.length) return { root: null, levels: [] };

  // STEP 1: Create leaf nodes by hashing each data block
  // Each node contains both the hash and original data
  let nodes = dataBlocks.map((block) => ({
    hash: hashData(block), // SHA-256 hash of the data block
    data: block, // Store original data for reference
  }));

  // Track all levels of the tree for debugging/visualization
  const levels = [nodes];

  // STEP 2: Build the tree bottom-up until we have a single root
  while (nodes.length > 1) {
    const nextLevel = [];

    // Process nodes in pairs to create parent nodes
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];

      // Handle odd number of nodes: duplicate the last node
      // This ensures we always have pairs for hashing
      const right = nodes[i + 1] || nodes[i];

      // Create parent node by hashing the concatenated hashes of children
      const combinedHash = hashData(left.hash + right.hash);

      // Parent node structure includes references to left and right children
      nextLevel.push({
        hash: combinedHash,
        left,
        right,
      });
    }

    // Move up one level in the tree
    nodes = nextLevel;
    levels.push(nodes);
  }

  // Return the tree structure
  // root: the single node at the top (Merkle root)
  // levels: array of arrays showing each level of the tree
  return { root: nodes[0], levels };
}

// Export the function so it can be used by other modules
module.exports = { buildMerkleTree };
