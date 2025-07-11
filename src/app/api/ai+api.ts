import Openai from "openai";
const openai = new Openai({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function POST(request: Request) {
  const { exerciseName } = await request.json();

  if (!exerciseName) {
    return Response.json(
      { error: "Exercise name is required" },
      { status: 404 }
    );
  }
  const prompt = `
  	You are a fitness coach.
	You are given an exercise, provide clear instructions on how to perform the exercise. Include if any equipment is required.
	Explain the exercise in detail and for a beginner.
	
	The exercise name is: ${exerciseName}

	Keep it short and concise. Use markdown formatting.

	Use the following format:

	## Equipment Required

	## Instructions

	### Tips

	### Variations

	### Safety

	keep spacing between the headings and the content.

Always use headings and subheadings.`;

  console.log(prompt);
  try {
    const responce = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [{ role: "user", content: prompt }],
    });
    console.log(responce);
    return Response.json({ message: responce.choices[0].message.content });
  } catch (error) {
    console.log("Error fetching AI guidelines", error);
    return Response.json(
      { error: "Error fetching AI guidelines" },
      { status: 500 }
    );
  }
}

// GET
// export async function GET	(request:Request) {}
