#!/bin/bash

# ==============================================================================
#  NariSuraksha AI | Morphed Image Abuse Reporting & Evidence Dossier Assistant
#  macOS Native Auto-Launcher Script
# ==============================================================================

# Ensure directory is absolute root regardless of Finder launch context
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# ANSI Color Codes
CYAN='\033[0;36m'
TEAL='\033[38;5;37m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# Clear terminal screen for crisp presentation
clear

echo -e "${TEAL}${BOLD}"
echo "  ╔════════════════════════════════════════════════════════════════════════╗"
echo "  ║                                                                        ║"
echo "  ║               ███╗   ██╗ █████╗ ██████╗ ██╗    ██╗    ██╗              ║"
echo "  ║               ████╗  ██║██╔══██╗██╔══██╗██║    ██║    ██║              ║"
echo "  ║               ██╔██╗ ██║███████║██████╔╝██║    ██║    ██║              ║"
echo "  ║               ██║╚██╗██║██╔══██║██╔══██╗██║    ╚═╝    ╚═╝              ║"
echo "  ║               ██║ ╚████║██║  ██║██║  ██║██║    ██╗    ██╗              ║"
echo "  ║               ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝    ╚═╝    ╚═╝              ║"
echo "  ║                                                                        ║"
echo "  ║           N A R I S U R A K S H A   A I   (v2.4 Sovereign)             ║"
echo "  ║     Morphed Image Abuse Reporting & Evidence Dossier Assistant         ║"
echo "  ║      Zero-Knowledge Evidence Vault • Section 65B Dossier Compiler      ║"
echo "  ╚════════════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

echo -e "${CYAN}[*] Initializing runtime environment on macOS...${RESET}"

# 1. Check Node.js and npm installations
if ! command -v node >/dev/null 2>&1; then
  echo -e "\n${RED}[ERROR] Node.js is not installed or not found in PATH.${RESET}"
  echo -e "${YELLOW}Please install Node.js (v18 or newer) from https://nodejs.org or run:${RESET}"
  echo -e "   brew install node\n"
  read -p "Press [Enter] to exit..."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo -e "\n${RED}[ERROR] npm is not installed or not in PATH.${RESET}"
  read -p "Press [Enter] to exit..."
  exit 1
fi

NODE_VER=$(node -v)
NPM_VER=$(npm -v)
echo -e "${GREEN}[✓] Detected Node.js ${NODE_VER} and npm ${NPM_VER}.${RESET}"

# 2. Check and install backend dependencies if missing
if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
  echo -e "\n${YELLOW}[!] Backend node_modules not detected. Installing dependencies...${RESET}"
  (cd "$SCRIPT_DIR/backend" && npm install)
  if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to install backend dependencies.${RESET}"
    exit 1
  fi
  echo -e "${GREEN}[✓] Backend dependencies installed.${RESET}"
fi

# 3. Check and install frontend dependencies if missing
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
  echo -e "\n${YELLOW}[!] Frontend node_modules not detected. Installing dependencies...${RESET}"
  (cd "$SCRIPT_DIR/frontend" && npm install)
  if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to install frontend dependencies.${RESET}"
    exit 1
  fi
  echo -e "${GREEN}[✓] Frontend dependencies installed.${RESET}"
fi

# 4. Clean up any stale instances on ports 5001 and 5173
echo -e "${DIM}[*] Releasing ports 5001 & 5173 if currently occupied...${RESET}"
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# 5. Trap signals to guarantee clean termination of child processes
cleanup() {
  echo -e "\n\n${YELLOW}[!] Intercepted exit signal. Shutting down NariSuraksha AI servers...${RESET}"
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null
  fi
  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null
  fi
  lsof -ti:5001 | xargs kill -9 2>/dev/null || true
  lsof -ti:5173 | xargs kill -9 2>/dev/null || true
  echo -e "${GREEN}[✓] All services terminated cleanly. Stay safe.${RESET}\n"
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 6. Spawn backend service
echo -e "\n${CYAN}[*] Starting lightweight Express backend service...${RESET}"
(cd "$SCRIPT_DIR/backend" && npm start > "$SCRIPT_DIR/backend.log" 2>&1) &
BACKEND_PID=$!
echo -e "${GREEN}[✓] Backend running in background (PID: ${BACKEND_PID}). Log: backend.log${RESET}"

# 7. Spawn frontend Vite server
echo -e "${CYAN}[*] Starting Vite React frontend application on port 5173...${RESET}"
(cd "$SCRIPT_DIR/frontend" && npm run dev > "$SCRIPT_DIR/frontend.log" 2>&1) &
FRONTEND_PID=$!
echo -e "${GREEN}[✓] Frontend server initiated (PID: ${FRONTEND_PID}). Log: frontend.log${RESET}"

# 8. Poll http://localhost:5173 until active
echo -e "\n${CYAN}[*] Waiting for application to boot...${RESET}"
MAX_RETRIES=30
COUNT=0
BOOTED=false

while [ $COUNT -lt $MAX_RETRIES ]; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200\|304"; then
    BOOTED=true
    break
  fi
  sleep 1
  COUNT=$((COUNT + 1))
  echo -ne "    Polling local server (${COUNT}/${MAX_RETRIES}s)...\r"
done

echo ""

if [ "$BOOTED" = true ]; then
  echo -e "${GREEN}${BOLD}[✓] SUCCESS! Application is live at http://localhost:5173${RESET}"
  echo -e "${TEAL}[*] Launching application in your default web browser...${RESET}"
  sleep 1
  open "http://localhost:5173"
else
  echo -e "${YELLOW}[!] Server took longer than expected to report ready.${RESET}"
  echo -e "${YELLOW}[*] Attempting browser launch at http://localhost:5173...${RESET}"
  open "http://localhost:5173"
fi

# 9. Terminal Status Dashboard
echo -e "\n${TEAL}────────────────────────────────────────────────────────────────────────${RESET}"
echo -e "  ${BOLD}ACTIVE SYSTEM STATUS & RUNTIME ENDPOINTS:${RESET}"
echo -e "  • Frontend UI:       ${CYAN}http://localhost:5173${RESET}"
echo -e "  • Backend API:       ${CYAN}http://localhost:5001 (or 5000)${RESET}"
echo -e "  • Health Check:      ${CYAN}http://localhost:5001/api/health${RESET}"
echo -e "  • Zero-Knowledge:    ${GREEN}Client-Side SHA-256 Enforced (Zero Server Uploads)${RESET}"
echo -e "  • Quick Exit:        ${RED}Press ESC in web browser anytime to purge session${RESET}"
echo -e "  • National Helpline: ${YELLOW}1930 (Cyber Crime) | 1091 (Women Helpline)${RESET}"
echo -e "${TEAL}────────────────────────────────────────────────────────────────────────${RESET}"
echo -e "\n${BOLD}Press [Ctrl+C] at any time in this window to stop both servers.${RESET}\n"

# Keep the script running to monitor child processes and trap signals
wait "$FRONTEND_PID" "$BACKEND_PID"
