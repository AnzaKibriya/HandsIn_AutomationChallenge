# Hands In - Interview Repository

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/hands-in/interview-repo?quickstart=1)
[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/hands-in/interview-repo)

This repository contains coding tests and challenges used by **Hands In** during the interview process for various technical roles. Each test is designed to evaluate specific skills and competencies relevant to different positions within our organization.

## 🎯 Purpose

This repository serves as a centralized location for all technical assessments used in our hiring process. The tests are role-specific and designed to evaluate candidates' technical skills, problem-solving abilities, and coding practices.

## 📁 Repository Structure

```
interview-repo/
├── tests/                    # All interview tests organized by role/type
│   └── nextjs-weather/      # Full-stack Next.js weather application test
├── package.json             # Root package.json with shared dependencies
├── nx.json                  # Nx workspace configuration
├── biome.json              # Code formatting and linting configuration
├── jest.config.ts          # Jest testing configuration
├── vitest.workspace.ts     # Vitest workspace configuration
└── README.md               # This file
```

## 🧪 Available Tests

### Full-Stack Development
- **Next.js Weather App** (`tests/nextjs-weather/`): A React/Next.js application testing full-stack development skills

### Coming Soon
- **QA/Testing**: Automated testing challenges
- **Backend**: API development and database design tasks
- **DevOps**: Infrastructure and deployment challenges

## 🛠️ Technology Stack

This repository uses a modern development stack:

- **Framework**: Nx monorepo for managing multiple test projects
- **Package Manager**: pnpm for efficient dependency management
- **Testing**: Jest and Vitest for unit and integration testing
- **Linting**: Biome for code formatting and linting
- **Language**: TypeScript for type safety
- **Node.js**: Version 22 (specified in package.json engines)

## 🚀 Getting Started

### Prerequisites
- Node.js 22
- pnpm (version 10.12.3+)

#### Installation
```bash
# Clone the repository
git clone https://github.com/hands-in/interview-repo.git
cd interview-repo

# Install dependencies
pnpm install
```

### Available Commands
```bash
# Clean all build artifacts
pnpm clean

# Build all projects
pnpm build

# Run type checking across all projects
pnpm typecheck

# Run all tests
pnpm test

# Run specific project (e.g., weather app)
nx dev weather    # Start development server
nx test weather   # Run tests for weather app
nx build weather  # Build weather app
```

## 📋 For Interviewers

### Setting Up a Test Session
1. Navigate to the specific test directory (e.g., `tests/nextjs-weather/`)
2. Follow the README instructions in that directory
3. Provide the candidate with the test requirements
4. Set appropriate time limits based on the role and test complexity

### Evaluation Criteria
Each test directory contains specific evaluation criteria, but generally assess:
- **Code Quality**: Clean, readable, and maintainable code
- **Problem Solving**: Approach to breaking down and solving problems
- **Technical Skills**: Proficiency with relevant technologies
- **Best Practices**: Following industry standards and conventions
- **Testing**: Writing and understanding of tests
- **Documentation**: Clear communication through code comments and documentation

## 📝 For Candidates

Welcome to the Hands In technical assessment! 

### General Guidelines
- Read all instructions carefully before starting
- Ask questions if anything is unclear
- Focus on writing clean, maintainable code
- Include tests where appropriate
- Document your thought process and any assumptions

### What We're Looking For
- **Problem-solving skills**: How you approach and break down problems
- **Code quality**: Clean, readable, and well-structured code
- **Technical proficiency**: Familiarity with the technologies used
- **Attention to detail**: Following requirements and handling edge cases
- **Communication**: Clear documentation and code comments

## 🤝 Contributing

### Adding New Tests
1. Create a new directory under `tests/` following the naming convention
2. Include a comprehensive README with:
   - Test description and objectives
   - Setup instructions
   - Requirements and acceptance criteria
   - Evaluation rubric
   - Expected time to complete
3. Add the test to the Nx workspace configuration
4. Update this main README to include the new test

### Test Directory Structure
```
tests/new-test-name/
├── README.md              # Test-specific instructions
├── package.json           # Test dependencies
├── project.json           # Nx project configuration
├── src/                   # Source code and starter files
└── docs/                  # Additional documentation (optional)
```

## 📞 Contact

For questions about this repository or the interview process, please contact the Hands In development team.

---

**Hands In** - Building the future, one hire at a time.
