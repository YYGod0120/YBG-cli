import { mdFile } from "../compile/extractMd";

//解析类型
export function transformType(files: mdFile[]) {
  let newData: { [x: string]: string }[] = [];
  files.forEach((file, index) => {
    const { mdMatter, mdHtml, id } = file;
    const { data } = mdMatter;
    const newMatter = {
      ...data,
      id: id,
      html: mdHtml,
    };
    newData.push(newMatter);
  });
  return newData;
}

// //操作一下数据库

// async function uploadBlogs(client, files: any[]) {
//   try {
//     await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//     // Create the "invoices" table if it doesn't exist
//     const createTable = await client.sql`
//       CREATE TABLE IF NOT EXISTS blogs (
//         id SERIAL PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         date DATE,
//         categories VARCHAR(255),
//         excerpt TEXT,
//         html TEXT
//       );
//     `;

//     console.log(`Created "blog" table`);

//     // Insert data into the "users" table
//     const insertedBlogs = await Promise.all(
//       files.map(async (file) => {
//         return client.sql`
//         INSERT INTO blogs (title, date, categories, excerpt, html)
//         VALUES (${file.id}, ${file.title}, ${file.date}, ${file.categories}, ${file.excerpt}, ${file.html})
//         ON CONFLICT (id) DO NOTHING;
//       `;
//       })
//     );

//     console.log(`upload ${insertedBlogs.length} blogs`);

//     return {
//       createTable,
//       blogs: insertedBlogs,
//     };
//   } catch (error) {
//     console.error("Error upload blogs:", error);
//     throw error;
//   }
// }

// //main
// export async function main() {
//   const files = transformType(await fileToJSON());
//   const client = await db.connect();
//   await uploadBlogs(client, files);
//   await client.end();
// }
// main().catch((err) => {
//   console.error(
//     "An error occurred while attempting to seed the database:",
//     err
//   );
// });
