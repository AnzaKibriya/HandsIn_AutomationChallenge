# Next.js Weather Application - Full-Stack Interview Challenge

## 🎯 Challenge Overview

**Time Limit**: 90 minutes  
**Target Role**: Full-Stack Developer  
**Difficulty**: Mid-Level  

This is a comprehensive full-stack development assessment that evaluates your skills in:
- **Backend**: API development, data management, business logic
- **Frontend**: React components, form handling, state management  
- **Testing**: Unit tests, TDD approach, edge case handling
- **TypeScript**: Type safety, interface implementation
- **Code Quality**: Clean code, error handling, best practices

You'll be implementing missing parts of a weather application where you can view and update weather data for various cities worldwide.

**Implementation Focus**: All your work will be in the `src/examined/` directory, which contains the starter templates for the core functionality you need to complete.

## 🚀 Quick Start

### GitHub Codespaces (Recommended)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/hands-in/interview-repo?quickstart=1)




## 📁 Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── api/weather/             # API Endpoints (Complete)
│   │   ├── route.ts             # GET & POST endpoints
│   │   ├── WeatherService.ts    # Interfaces and types
│   │   ├── WeatherService.test.ts # Unit Tests
│   │   └── weather-data.ts      # Sample data (23 entries)
│   ├── components/              # UI Components (Complete)
│   └── page.tsx                 # Main page (Complete)
└── examined/                    # 🔴 You Need To Implement 
    ├── DefaultWeatherService.ts # Implement Service methods
    ├── DefaultWeatherService.test.ts # Implement Unit Tests
    └── AddWeatherDataForm.tsx   # Complete form submission
```

# 💡 **Key Point**: **You only need to work in the `src/examined/` directory. Everything else is provided and working.**

## 📋 What You Need to Implement

### 🔴 CRITICAL TASKS (Must Complete)

#### 1. **Backend Service Implementation** ⭐ **HIGH PRIORITY**
**File**: `src/examined/DefaultWeatherService.ts`

The `DefaultWeatherService` class currently has **method stubs**. You need to implement:

```typescript
export class DefaultWeatherService implements WeatherService {
    // ❌ MISSING: Complete implementation
    getWeather(_query: WeatherQuery): WeatherData[] {
        throw new Error("getWeather method not implemented");
    }

    // ❌ MISSING: Complete implementation  
    updateWeather(_weather: WeatherData): void {
        throw new Error("updateWeather method not implemented");
    }
}
```

**Requirements:**
- Use the provided sample data from `weather-data.ts` (23 entries across multiple countries)
- Implement filtering by country (required), city (optional), date (optional)
- Handle updates: replace existing entries or add new ones based on country, city, and date
- Return latest data when no date specified (most recent date for each city)
- Handle edge cases like non-existent countries, cities, or dates

#### 2. **Unit Tests Implementation** ⭐ **HIGH PRIORITY**
**File**: `src/examined/DefaultWeatherService.test.ts`

Currently has **test stubs**. You need to implement:

```typescript
describe("DefaultWeatherService Unit Tests", () => {
    it("should return latest weather for specific city and date", () => {
        // TODO: Test exact city and date matching
        throw new Error("Test not implemented");
    });

    it("should return latest weather for all cities when only country specified", () => {
        // TODO: Test country-only filtering with latest data per city
        throw new Error("Test not implemented");
    });

    it("Should handle returning the most recent weather data once it has been updated", () => {
        // TODO: Test updateWeather and verify data persistence
        throw new Error("Test not implemented");
    });
});
```

#### 3. **Frontend Form Integration** ⭐ **HIGH PRIORITY**
**File**: `src/examined/AddWeatherDataForm.tsx`

The form is **95% complete** but missing the critical API call in submission:

```typescript
const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    // ❌ MISSING: Actual API call implementation
    // TODO: Replace the placeholder setTimeout with real POST request
    // TODO: Handle response properly and show user feedback
    
    setTimeout(() => onSuccess(), 1000);
    throw new Error("Form submission not implemented");
};
```

```typescript
describe("DefaultWeatherService Unit Tests", () => {
    // ❌ MISSING: Test implementations (stubs provided)
    it("should return latest weather for specific city and date", () => {
        // TODO: Test exact city and date matching
        throw new Error("Test not implemented");
    });
    
    it("should return latest weather for all cities when only country specified", () => {
        // TODO: Test country-only filtering with latest data
        throw new Error("Test not implemented");
    });
    
    it("Should handle returning the most recent weather data once it has been updated", () => {
        // TODO: Test updateWeather and verify persistence
        throw new Error("Test not implemented");
    });
});
```

## 🟡 PROVIDED (Ready to Use)

### ✅ **Working Components**
- **Main Page** (`src/app/page.tsx`) - Unified weather interface with search and edit
- **Dropdown Components** - Country and City selection with proper data flow
- **WeatherService Interface** - Complete type definitions and contracts
- **Sample Data** - 23 weather entries across 10+ countries
- **UI Styling** - Complete Tailwind CSS implementation
- **Project Setup** - Next.js, TypeScript, Jest all configured

### ✅ **Working API Endpoints**  
- **GET `/api/weather`** - Fully implemented with validation and filtering
- **POST `/api/weather`** - Fully implemented with validation and error handling

### ✅ **Working Features**  
- Weather data display and filtering
- Edit mode for weather entries
- Form validation and state management
- Responsive design
- Error handling UI components
- Comprehensive test suite for edge cases (`src/app/api/weather/WeatherService.test.ts`)

## 📊 Sample Data Structure

You have access to 23 weather entries like this:

```typescript
{
    id: "london_uk_2025_07_31",
    country: "United Kingdom", 
    city: "London",
    temperature: 22,
    humidity: 60,
    windSpeed: 15.2,
    date: "2025-07-31",
    weather: Weather.CLOUDY
}
```

**Available Countries**: United States, United Kingdom, Canada, Germany, France, Japan, Australia, Brazil, India, Norway

## 🧪 Testing & Development
 Strategy

### Running Tests
```bash
# Watch mode (recommended)
nx test weather --watch

# Single run  
npm test weather

# IDE
Use the `Run` button next to each test
```

### Running development
```bash
# Watch mode (recommended)
nx dev weather
```

## 🎯 Success Criteria

### Backend Implementation (50 points)
- [ ] **DefaultWeatherService.getWeather()** correctly filters data by country, city, date combinations
- [ ] **DefaultWeatherService.updateWeather()** adds new entries and updates existing ones properly
- [ ] Proper handling of edge cases (non-existent countries, cities, dates)
- [ ] Latest data logic implemented correctly (most recent date per city)
- [ ] TypeScript compliance and proper error handling

### Testing & Quality (30 points)
- [ ] **Unit tests** in `src/examined/DefaultWeatherService.test.ts` implemented and passing
- [ ] **Test coverage** for core functionality (country, city, date filtering)
- [ ] **Update behavior testing** with data persistence verification
- [ ] Tests actually pass and provide meaningful assertions

### Frontend Integration (20 points)  
- [ ] **AddWeatherDataForm** submission implemented with real API call
- [ ] Form handles success/error responses properly
- [ ] User feedback and loading states work correctly
- [ ] Integration with backend API endpoints

## 🚨 Common Pitfalls to Avoid

1. **Don't modify provided interfaces or working components** - Implement only the TODO methods in the examined directory
2. **Don't skip edge case handling** - Handle non-existent countries, cities, and dates gracefully  
3. **Don't ignore the "latest data" requirement** - When no date is specified, return the most recent data
4. **Don't skip the test implementation** - The test stubs in `examined/` directory need your implementation
5. **Don't overcomplicate the form submission** - Use the provided form state and make a simple POST request

## 🎉 Evaluation Focus

We're looking for:
- **Problem-solving approach** - How you break down the tasks
- **Code quality** - Clean, maintainable implementation  
- **Testing mindset** - TDD approach and edge case consideration
- **Full-stack skills** - Backend logic + frontend integration
- **TypeScript proficiency** - Proper type usage and safety

**Good luck!** Focus on getting the core functionality working first, then refine and test. Quality over quantity!
