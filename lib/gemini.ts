import { GoogleGenAI } from "@google/genai";
export async function geminiResponse(prompt: string) {
    try {
        const apiKey=process.env.GEMINI_API_KEY
        if(!apiKey){
console.log("apikey is missing")
        }
        const ai = new GoogleGenAI({apiKey});

        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: prompt,
        });
        console.log(interaction.output_text);
        return interaction.output_text

    } catch (err) {

console.log("Error in gemin : ",err)


    }
}