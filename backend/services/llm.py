from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class AuditResult(BaseModel):
    security: List[str] = Field(description="Lista de vulnerabilidades de seguridad encontradas. Lista vacía si no hay ninguna.")
    quality: List[str] = Field(description="Lista de problemas de calidad de código o anti-patrones.")
    summary: str = Field(description="Resumen breve de los cambios realizados.")

class AIAuditService:
    def __init__(self):
        # Usaremos Llama 3 vía Ollama para mantener el código privado y On-Premise
        # Cambiar a ChatOpenAI o ChatGoogleGenerativeAI requiere muy pocas modificaciones
        self.llm = ChatOllama(
            base_url="http://host.docker.internal:11434",
            model="llama3", 
            temperature=0.1,
            format="json"
        )
        
    def analyze_diff(self, diff_content: str) -> dict:
        output_parser = JsonOutputParser(pydantic_object=AuditResult)
        format_instructions = output_parser.get_format_instructions()
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Eres un experto DevSecOps y auditor de código automatizado. Tu objetivo es analizar un git diff, encontrar fallos. REGLA CRÍTICA: Debes responder ÚNICAMENTE con un objeto JSON válido y NADA MÁS. No agregues texto introductorio. OTRA REGLA CRÍTICA: Todas tus explicaciones y resúmenes DEBEN estar redactados 100% en Español."),
            ("user", "Analiza el siguiente DIFF de código:\n\n{diff}\n\n{format_instructions}\n\nRECUERDA: Escribe todas las vulnerabilidades y problemas estrictamente en idioma Español. DEVUELVE SOLO JSON Y NADA MÁS:")
        ])
        
        chain = prompt | self.llm | output_parser
        
        try:
            # Protegemos contra diffs extremadamente largos cortando el string por ahora
            safe_diff = diff_content[:3000] if len(diff_content) > 3000 else diff_content
            response = chain.invoke({
                "diff": safe_diff,
                "format_instructions": format_instructions
            })
            return response
        except Exception as e:
            print(f"Error LLM Fallback: {e}")
            # Mock de respuesta en caso de que Ollama no esté corriendo localmente
            return {
                "security": ["El modelo de IA local no está encendido o falló la conexión (Mock)."],
                "quality": ["Asegúrate de tener Llama 3 ejecutándose localmente para resultados reales."],
                "summary": "Fallo de inferencia, usando datos simulados."
            }
