const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const main = async () => {
  const inPath = path.resolve(`${__dirname}/files/in`, "input.docx");
  const outPath = path.resolve(`${__dirname}/files/out`, "output.docx");

  const content = fs.readFileSync(
      path.resolve(inPath),
      "binary"
  );

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });

  const newObjective = await askQuestion('Objetivo? ');
  const newSkills = formatSkills(await askQuestion('Habilidades? '));

  await replaceText(doc, newObjective, newSkills);
  const buf = writeOutput(doc, outPath);
  
  fs.writeFileSync(outPath, buf);
  console.log('Arquivo gerado com sucesso!');
}

const askQuestion = async (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}


const replaceText = async (doc, newObjective, newSkills) => {
  doc.render({
    objective: newObjective,
    skills: newSkills
  })

  return;
}


const writeOutput = (doc, outPath) => {
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buf;
}

const formatSkills = (skills) => {
  return skills.split(',').map(skill => {
    return {
      name: skill
    }
  });
}

main();