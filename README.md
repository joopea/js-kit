# JS-Kit

## Overview
A utility package for everyday use in JavaScript/Node.js applications.

## Features
This package is under constant development to add the utilities that are needed. At the moment these are the functionalities:

- **Filer**: Simplifies file operations on the drive/server.
- **Logger**: A comprehensive logging class.
- **Utils**: Collection of utility functions for common tasks.

## Installation
```bash
npm install @joopea/js-kit
```

## Usage

### Filer
```javascript
const { Filer } = require('@joopea/js-kit');

// Example usage
const content = await Filer.readFileContent('path/to/file.txt');
await Filer.writeToFile('Hello World!', 'path/to/file.txt');
```

### Logger
```javascript
const { Logger } = require('@joopea/js-kit');

const logger = new Logger();
logger.log('This is an info message');
logger.error('This is an error message');
```

## License
MIT License. See `LICENSE` file for more details.

## Contributing
Contributions are welcome. Please submit a pull request or open an issue to discuss on the [package's repository on GitHub](https://github.com/joopea/js-kit).

## Contact
For any questions or inquiries, please contact [Raham](raham@joopea.com) @ [JAssist](https://jassist.eu) by [JoopeA Foundation](https://joopea.info).

- JoopeA website: [https://joopea.info]
- JAssist website: [https://jassist.eu]
- JoopeA GitHub account: [https://github.com/joopea/]
