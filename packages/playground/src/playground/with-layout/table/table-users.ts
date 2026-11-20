export interface TableUser {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  city: string;
  joined: Date;
}

const names = [
  'Jane Doe',
  'John Smith',
  'Alex Johnson',
  'Sam Taylor',
  'Chris Brown',
  'Pat Miller',
  'Jordan Davis',
  'Taylor Wilson',
  'Morgan Moore',
  'Casey Clark',
  'Riley Lewis',
  'Jamie Walker',
  'Drew Hall',
  'Avery Allen',
  'Quinn Young',
  'Reese King',
  'Skyler Wright',
  'Parker Scott',
  'Rowan Green',
  'Hayden Adams',
  'Emerson Baker',
  'Finley Nelson',
  'Sage Carter',
  'Blake Mitchell',
];
const cities = ['London', 'New York', 'Chicago', 'Manchester', 'Boston', 'Leeds'];
const roles: TableUser['role'][] = ['Admin', 'Editor', 'Viewer', 'Viewer'];

/** Example users, the same every time. */
export const TABLE_USERS: TableUser[] = names.map((name, index) => ({
  id: index + 1,
  name,
  email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
  role: roles[index % roles.length],
  city: cities[(index * 5) % cities.length],
  joined: new Date(2024, (index * 7) % 12, 1 + ((index * 11) % 28)),
}));
