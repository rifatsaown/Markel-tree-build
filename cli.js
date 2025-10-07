#!/usr/bin/env node
/*
 * Shebang line: tells the system to run this file with Node.js
 * This allows the file to be executed directly from the command line
 */

// Import required Node.js modules
const fs = require('fs'); // File system operations
const path = require('path'); // Path manipulation utilities
const { program } = require('commander'); // Command-line interface framework
const { buildMerkleTree } = require('./merkle'); // Our Merkle tree implementation

/**
 * Configure the CLI program using Commander.js
 * This sets up all the command-line options and arguments
 */
program
  .name('merkle-cli') // Program name shown in help
  .description('Merkle Tree CLI Tool') // Description for help text
  .option('--input-file <path>', 'File with data blocks (one per line)') // File input option
  .option('--output-file <path>', 'Save Merkle tree JSON to file') // File output option
  .option('--pretty', 'Pretty-print JSON output') // Formatting option
  .argument('[data...]', 'Data blocks to build the tree') // Direct data arguments
  .parse(); // Parse command-line arguments

// Get parsed options and arguments
const opts = program.opts(); // Options (--flags)
let dataBlocks = program.args; // Arguments (direct data)

/**
 * STEP 1: Handle input file processing
 * If --input-file is specified, read data from file
 */
if (opts.inputFile) {
  // Convert relative path to absolute path for reliability
  const filePath = path.resolve(opts.inputFile);

  // Check if file exists before trying to read it
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1); // Exit with error code
  }

  // Read file and process the content
  const fileData = fs
    .readFileSync(filePath, 'utf-8') // Read as UTF-8 text
    .split('\n') // Split into lines
    .map((line) => line.trim()) // Remove whitespace
    .filter(Boolean); // Remove empty lines

  // Combine file data with command-line arguments
  dataBlocks = [...dataBlocks, ...fileData];
}

/**
 * STEP 2: Validate input
 * Ensure we have at least one data block to process
 */
if (!dataBlocks.length) {
  console.error('Error: No data blocks provided.');
  process.exit(1);
}

/**
 * STEP 3: Build the Merkle Tree
 * This is the core functionality - create the tree structure
 */
const { root } = buildMerkleTree(dataBlocks);

// Validate that tree was built successfully
if (!root) {
  console.error('Error: Merkle Tree could not be built.');
  process.exit(1);
}

/**
 * STEP 4: Generate JSON output
 * Convert the tree to JSON format with optional pretty-printing
 */
const json = JSON.stringify(
  root, // The tree root object
  null, // No replacer function
  opts.pretty ? 2 : 0 // Indentation: 2 spaces if --pretty, none otherwise
);

/**
 * STEP 5: Output handling
 * Either save to file or display to console
 */
if (opts.outputFile) {
  // Save JSON to specified file
  fs.writeFileSync(opts.outputFile, json);
  console.log(`Merkle tree saved to ${opts.outputFile}`);
} else {
  // Display JSON to console
  console.log('Merkle Tree JSON:');
  console.log(json);
}

/**
 * STEP 6: Display the Merkle Root
 * Always show the root hash as it's the most important result
 */
console.log(`\nMerkle Root: ${root.hash}`);
