# Enquiry App

A beautiful and modern Angular application for managing customer enquiries with a clean Material Design interface.

## Features

- 📝 **Create Enquiries**: Beautiful form with validation for submitting new enquiries
- 📋 **View Enquiries**: Grid layout displaying all enquiries with status indicators
- 🔍 **Enquiry Details**: Detailed view of individual enquiries
- 🎨 **Modern UI**: Built with Angular Material for a professional look
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Real-time Updates**: Live status updates and notifications
- 🎯 **Status Management**: Track enquiry progress (Pending, In Progress, Resolved)

## Tech Stack

- **Frontend**: Angular 20.2.0 with TypeScript
- **UI Framework**: Angular Material
- **Styling**: CSS3 with Material Design principles
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router with lazy loading

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v20.2.1 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EnquiryAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular Material (if not already installed)**
   ```bash
   ng add @angular/material
   ```

## Running the Application

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Mock API Server

For testing purposes, a mock API server is included:

1. **Install mock API dependencies**
   ```bash
   npm install express cors nodemon --save-dev
   ```

2. **Start the mock API server**
   ```bash
   node mock-api.js
   ```

   The mock API will run on `http://localhost:3000`

3. **Update API URL** (if needed)
   
   In `src/app/services/enquiry.service.ts`, update the `API_URL` to match your backend:
   ```typescript
   private readonly API_URL = 'http://localhost:3000/api/enquiries';
   ```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── enquiry-form/          # Form for creating new enquiries
│   │   ├── enquiry-list/          # Grid view of all enquiries
│   │   └── enquiry-detail/        # Detailed view of individual enquiry
│   ├── models/
│   │   └── enquiry.model.ts       # TypeScript interfaces
│   ├── services/
│   │   └── enquiry.service.ts     # API communication service
│   ├── app.config.ts              # App configuration
│   ├── app.routes.ts              # Routing configuration
│   └── app.html                   # Main app template
├── styles.css                     # Global styles
└── main.ts                        # Application entry point
```

## API Endpoints

The application expects the following API endpoints:

- `GET /api/enquiries` - Get all enquiries
- `GET /api/enquiries/:id` - Get enquiry by ID
- `POST /api/enquiries` - Create new enquiry
- `PATCH /api/enquiries/:id/status` - Update enquiry status
- `DELETE /api/enquiries/:id` - Delete enquiry

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

## Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Testing

```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## Features in Detail

### Enquiry Form
- **Validation**: Real-time form validation with error messages
- **Responsive**: Adapts to different screen sizes
- **User-friendly**: Clear labels and helpful hints
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Enquiry List
- **Grid Layout**: Beautiful card-based layout
- **Status Indicators**: Color-coded status chips
- **Search & Filter**: Easy to find specific enquiries
- **Actions**: Quick access to view, edit, and delete

### Enquiry Details
- **Complete Information**: All enquiry details in one view
- **Status Management**: Easy status updates
- **Contact Information**: Quick access to customer details
- **Message Display**: Full message with proper formatting

## Customization

### Themes
The app uses Angular Material's indigo-pink theme. To customize:

1. Create a custom theme in `src/styles.css`
2. Import your theme instead of the default one

### Colors
Update the CSS custom properties in `src/styles.css` to match your brand colors.

### API Integration
To connect to your own API:

1. Update the `API_URL` in `enquiry.service.ts`
2. Ensure your API follows the expected response format
3. Add authentication headers if required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

---

**Happy Coding! 🚀**