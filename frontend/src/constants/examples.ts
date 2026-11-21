export const EXAMPLE_ERRORS = [
  {
    id: 'npm-eresolve',
    label: 'npm Dependency Conflict',
    technology: ['Node.js', 'npm'],
    error: `npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! 
npm ERR! While resolving: my-app@0.1.0
npm ERR! Found: react@18.2.0
npm ERR! node_modules/react
npm ERR!   react@"^18.2.0" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^17.0.1" from some-package@2.1.0`
  },
  {
    id: 'python-module',
    label: 'Python ModuleNotFoundError',
    technology: ['Python'],
    error: `Traceback (most recent call last):
  File "main.py", line 1, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'`
  },
  {
    id: 'react-vite',
    label: 'React / Vite Build Error',
    technology: ['React', 'Vite'],
    error: `[vite] Internal server error: Failed to resolve import "/src/main.tsx" from "index.html". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/dev/my-app/index.html
  at TransformPluginContext._formatError (node_modules/vite/dist/node/chunks/dep-26b4ddef.js:50660:41)`
  },
  {
    id: 'java-npe',
    label: 'Java NullPointerException',
    technology: ['Java'],
    error: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "str" is null
  at com.example.Main.processString(Main.java:15)
  at com.example.Main.main(Main.java:8)`
  },
  {
    id: 'mysql-access',
    label: 'MySQL Access Denied',
    technology: ['MySQL'],
    error: `ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)
Can't connect to MySQL server on 'localhost' (10061)
mysqladmin: connect to server at 'localhost' failed`
  }
];

export const TECHNOLOGIES = [
  'Auto Detect', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Java', 'C++', 'C', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker',
  'Kubernetes', 'Git', 'Linux', 'Next.js', 'Vite', 'Other'
];
