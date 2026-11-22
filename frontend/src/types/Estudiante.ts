// TAD Tipo de Documento (docs/).
export interface TipoDocumento {
  id: number
  tipo: string
}

// TAD Estudiante (docs/).
export interface Estudiante {
  id: number
  codigoEstudiantil: string
  tipoDocumento: TipoDocumento
  numeroDocumento: string
  nombre: string
  correo: string
  celular: string
}
