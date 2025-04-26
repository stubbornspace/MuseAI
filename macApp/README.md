# MuseAI Mac App

A desktop application built with Tauri and React.

## Prerequisites

Before you can run or build this application, you need to install the following:

1. **Node.js and npm**
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Recommended version: LTS (Long Term Support)

2. **Rust and Cargo**
   - Install Rust using rustup:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
   - Follow the installation prompts
   - After installation, restart your terminal
   - Verify installation:
   ```bash
   rustc --version
   cargo --version
   ```

3. **Tauri CLI**
   ```bash
   cargo install tauri-cli
   ```

4. **System Dependencies**
   - For macOS:
   ```bash
   # Install Xcode Command Line Tools
   xcode-select --install
   
   # Install required system libraries
   brew install pkg-config
   ```

## Development Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd macApp
   ```

2. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run tauri dev
   ```

## Building for Production

1. **Build the application**
   ```bash
   npm run tauri build
   ```

2. **The built application will be located in:**
   - macOS: `src-tauri/target/release/bundle/dmg/`

## Troubleshooting

1. **Rust/Cargo Issues**
   - If you get cargo-related errors, try:
   ```bash
   rustup update
   cargo update
   ```

2. **Tauri Build Issues**
   - If the build fails, ensure all system dependencies are installed
   - Check that Xcode Command Line Tools are properly installed
   - Verify Rust and Cargo are in your PATH

3. **Permission Issues**
   - If you encounter permission errors, you might need to:
   ```bash
   sudo xcodebuild -license accept
   ```

## Project Structure

- `src/` - React application source code
- `src-tauri/` - Tauri backend and configuration
- `public/` - Static assets

## Available Scripts

- `npm run tauri dev` - Start development server
- `npm run tauri build` - Build production version
- `npm run tauri info` - Display system information for debugging
