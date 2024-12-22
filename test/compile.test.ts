import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { promises as fs } from 'fs';
import { compileByRemark } from '../src/compile/compileByRemark'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
describe('Markdown Compiler', () => {
  let mdContent:string;
  beforeAll(async () => {
    // 读取测试用的 markdown 文件
    const testFilePath = path.join(__dirname, 'markdownCase', 'case1.md');
    mdContent = await fs.readFile(testFilePath, 'utf8');
    console.log('setup');
    
  });
  test('should compile markdown content', () => { 
    return compileByRemark(mdContent).then((data)=>{
      //断言
      expect(data).toBeDefined(); //判断有产物
      //判断生成物结构（只能说大概判断）
      expect(data).toContain('<p>');
      expect(data).toContain('<h1>');
      expect(data).toContain('{t("0")}');
    })
  });
  afterAll(()=>{
    console.log('done');
  })
});

