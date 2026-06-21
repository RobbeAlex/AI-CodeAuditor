import requests

class GitHubService:
    def __init__(self, token: str = None):
        self.token = token
        
    def get_pr_diff(self, repository_name: str, pr_number: int) -> str:
        """
        Obtiene el diff crudo de un PR de GitHub.
        Para repositorios públicos, usa la URL de la API con el header correcto.
        """
        url = f"https://api.github.com/repos/{repository_name}/pulls/{pr_number}"
        headers = {"Accept": "application/vnd.github.v3.diff"}
        
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
            
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                return response.text
            else:
                return f"Error HTTP {response.status_code}: No se pudo obtener el diff."
        except Exception as e:
            return f"Error de conexión: {str(e)}"
