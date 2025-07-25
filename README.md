# StickyTasks

A full-stack todo application built with MongoDB, Express.js, React, and Node.js.

## Preview

<div align="center">
  
![StickyTasks Overview](Examples/FullPage.png)

</div>

<div align="center">

<table>
<tr>
<td align="center"><b>Add Tasks</b></td>
<td align="center"><b>All Tasks</b></td>
<td align="center"><b>Active Tasks</b></td>
<td align="center"><b>Completed Tasks</b></td>
</tr>
<tr>
<td><img src="Examples/1.png" width="200"/></td>
<td><img src="Examples/4.png" width="200"/></td>
<td><img src="Examples/3.png" width="200"/></td>
<td><img src="Examples/2.png" width="200"/></td>
</tr>
</table>

</div>

## Features

- Add, edit, delete, and toggle todos
- Filter todos by status (All, Active, Completed)
- Set priorities and due dates
- Category organization
- Statistics dashboard
- Responsive design

## Setup

### Prerequisites
- Node.js
- MongoDB OR Docker

### Quick Start with Docker (Recommended)

1. Clone the repository
2. Run the setup script:
```bash
# Linux/Mac
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh

# Windows
scripts/dev-setup.ps1
```

3. Start the application:
```bash
npm run dev
```

### Manual Setup (Without Docker)

1. Install MongoDB locally
2. Install dependencies:
```bash
npm run install-all
```

3. Create `.env` file in backend directory:
```
MONGODB_URI=mongodb://localhost:27017/stickytasks
PORT=5000
```

4. Start the application:
```bash
npm run dev
```

### Docker Commands

```bash
npm run docker:mongo      
npm run docker:admin      
npm run docker:down       
npm run docker:logs         
```