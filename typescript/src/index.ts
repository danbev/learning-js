interface User {
  name: string;
  age: number;
}

export function name(user: User = {name: 'Fletch', age: 46}): string {
  return `Hello ${user.name}! `;
}

console.log(name());
