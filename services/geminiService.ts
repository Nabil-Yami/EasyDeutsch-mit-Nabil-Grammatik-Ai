import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateGermanGrammarLesson = async (topic: string): Promise<string> => {
    try {
        const systemInstruction = `أنت مدرس خبير في قواعد اللغة الألمانية متخصص في تعليم الناطقين بالعربية. مهمتك هي شرح المفاهيم النحوية الألمانية بوضوح ودقة باستخدام اللغة العربية الفصحى. استخدم تنسيقًا منظمًا مع عناوين وأمثلة وترجمات. اجعل الشرح مناسبًا للمبتدئين.`;

        const prompt = `
        اشرح القاعدة النحوية الألمانية التالية: "${topic}"

        يجب أن يتبع الشرح الهيكل التالي بدقة:

        ### **عنوان القاعدة**

        **1. الشرح:**
        شرح مبسط وواضح للقاعدة.

        **2. أمثلة:**
        - جملة ألمانية (مع ترجمتها بالعربية).
        - جملة ألمانية أخرى (مع ترجمتها بالعربية).
        - جملة ثالثة (مع ترجمتها بالعربية).

        **3. ملخص أو جدول (إن وجد):**
        إذا كان ذلك مناسبًا، قم بإنشاء جدول باستخدام تنسيق الماركداون (Markdown) لتلخيص المعلومات. مثال:
        | الحالة | المذكر (Der) | المؤنث (Die) | المحايد (Das) |
        |---|---|---|---|
        | Nominativ | der | die | das |
        | Akkusativ | den | die | das |


        **4. ملاحظات:**
        أي استثناءات أو نقاط مهمة يجب تذكرها.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error generating lesson from Gemini API:", error);
        throw new Error("فشل في إنشاء الدرس من خدمة الذكاء الاصطناعي. الرجاء التحقق من اتصالك والمحاولة مرة أخرى.");
    }
};


export const elaborateOnExamples = async (topic: string, lessonText: string): Promise<string> => {
    try {
        const systemInstruction = `أنت مدرس خبير في قواعد اللغة الألمانية متخصص في تعليم الناطقين بالعربية. مهمتك هي تحليل الأمثلة النحوية وتقديم شروحات مفصلة لمساعدة المتعلمين على فهم الفروق الدقيقة، مع التركيز على الأخطاء الشائعة.`;

        const prompt = `
        بناءً على درس قواعد اللغة الألمانية التالي حول موضوع "${topic}":
        --- بداية الدرس ---
        ${lessonText}
        --- نهاية الدرس ---

        مهمتك هي تقديم شرح مفصل لكل جملة مثال موجودة في الدرس أعلاه.

        لكل مثال، اتبع الهيكل التالي بدقة:

        **- [الجملة الألمانية الأصلية] ([ترجمتها بالعربية])**

        **1. تحليل نحوي:**
        اشرح سبب استخدام التراكيب النحوية المحددة (مثل تصريف الفعل، حالة الاسم، ترتيب الكلمات، إلخ) في هذه الجملة.

        **2. خطأ شائع للمتحدثين بالعربية:**
        سلط الضوء على خطأ محتمل قد يرتكبه المتحدث بالعربية عند تكوين جملة مماثلة، واشرح كيفية تجنبه.

        استخدم اللغة العربية الفصحى الواضحة، وقم بتنسيق الإخراج باستخدام الماركداون (Markdown) لسهولة القراءة.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5,
            }
        });

        return `### **🔍 شرح مفصل لأمثلة درس "${topic}"**\n\n` + response.text;
    } catch (error) {
        console.error("Error elaborating on examples from Gemini API:", error);
        throw new Error("فشل في تحليل الأمثلة. الرجاء التحقق من اتصالك والمحاولة مرة أخرى.");
    }
};

export const generateDiagram = async (topic: string): Promise<string> => {
    try {
        const systemInstruction = `أنت خبير في تبسيط قواعد اللغة الألمانية للناطقين بالعربية باستخدام المخططات. مهمتك هي إنشاء كود Mermaid.js لإنشاء مخطط انسيابي (flowchart) أو خريطة ذهنية (mindmap) واضحة وسهلة الفهم. يجب أن يحتوي المخطط على الكلمات الرئيسية باللغة الألمانية وترجمتها أو شرحها بالعربية.`;

        const prompt = `
        أنشئ مخططًا باستخدام صيغة Mermaid.js لشرح القاعدة النحوية الألمانية: "${topic}".

        إرشادات:
        1.  استخدم مخططًا انسيابيًا (graph TD). اجعل اتجاه المخطط من الأعلى للأسفل.
        2.  يجب أن يكون المخطط بسيطًا ومرئيًا ومنظمًا بشكل منطقي.
        3.  ابدأ بالمفهوم العام في الأعلى، ثم تفرع إلى الفئات الرئيسية (مثل الاستخدامات، التصريف، إلخ).
        4.  استخدم العقد (nodes) لتوضيح الأجزاء الرئيسية للقاعدة، والأسهم (edges) لإظهار العلاقات.
        5.  يجب أن تحتوي العقد على مصطلحات ألمانية مهمة مع شرح موجز أو ترجمة بالعربية.
        6.  اجمع الأمثلة ذات الصلة معًا في نفس العقدة أو في عقد فرعية متجاورة للحفاظ على التوازن.
        7.  الإجابة يجب أن تكون فقط كود Mermaid.js صالحًا ومغلفًا بـ \`\`\`mermaid ... \`\`\`. لا تقم بتضمين أي نص أو شرح إضافي. **مهم**: يجب أن تحتوي إجابتك **فقط** على كتلة كود Mermaid.js ولا شيء آخر.

        مثال لموضوع "Akkusativ Präpositionen":
        \`\`\`mermaid
        graph TD
            A[Präpositionen mit Akkusativ <br> حروف الجر مع المفعول به] --> B{durch <br> عبر};
            A --> C{für <br> لأجل};
            A --> D{gegen <br> ضد};
            A --> E{ohne <br> بدون};
            A --> F{um <br> حول};
            B --> G["Ich gehe <b>durch</b> den Park."];
            C --> H["Das Geschenk ist <b>für</b> dich."];
        \`\`\`
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.3,
            }
        });

        const text = response.text;
    
        // Try to find a fenced code block first. This is the most reliable way.
        // It handles ```mermaid, ```, and potential surrounding text from the model.
        const mermaidCodeMatch = text.match(/```(?:mermaid)?\s*([\s\S]*?)\s*```/);
        if (mermaidCodeMatch && mermaidCodeMatch[1]) {
            return mermaidCodeMatch[1].trim();
        }

        // If no block is found, assume the entire response might be the code.
        // This is for cases where the model returns raw code without fences.
        // We check for common Mermaid keywords to be safer.
        const trimmedText = text.trim();
        if (trimmedText.startsWith('graph') || trimmedText.startsWith('mindmap')) {
            return trimmedText;
        }
        
        // If we are here, the response is likely not what we want.
        // Throwing an error is better than letting mermaid.js fail silently.
        throw new Error("فشل في استخراج المخطط. لم يتم العثور على كود Mermaid.js صالح في استجابة الذكاء الاصطناعي.");


    } catch (error) {
        console.error("Error generating diagram from Gemini API:", error);
        if (error instanceof Error && error.message.includes("فشل في استخراج المخطط")) {
            throw error;
        }
        throw new Error("فشل في إنشاء المخطط. الرجاء التحقق من اتصالك والمحاولة مرة أخرى.");
    }
};