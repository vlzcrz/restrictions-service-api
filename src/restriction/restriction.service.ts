import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestrictionDto } from './dto/create-restriction.dto';
import { UpdateRestrictionDto } from './dto/update-restriction.dto';
import { Firestore } from '@google-cloud/firestore';
import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'

@Injectable()
export class RestrictionService {

  constructor(private readonly firestore: Firestore) {}

  async getRestriccion(uuid_estudiante: string) {
    const docRef = this.firestore.collection("restrictions");
    const query = docRef.where('uuid_estudiante', '==', uuid_estudiante)
    const snapshot = await query.get()
    if (snapshot.empty) {
      throw new NotFoundException('No existen registros de documentos con la uuid_estudiante asociada');
    } else {
      return snapshot.docs.map(doc => ({ uuid_restriccion: doc.id, ...doc.data() }))
    }
  }

  async validateRestriccion(uuid_estudiante: string) {
    const docRef = this.firestore.collection("restrictions")
    const query = docRef.where('uuid_estudiante', '==', uuid_estudiante).where('isActive', '==', true)
    const snapshot = await query.get()

    if(snapshot.empty) {
      const res = {
        validation: false,
        message: 'No hay restricciones activas asociadas a este estudiante'
      }
      return res
    } else {
      const res = {
        validation: true,
        message: 'Hay restricciones activas asociadas a este estudiante'
      }
      return res
    }
  }

  async createRestriccion(createRestrictionDto: CreateRestrictionDto) {
    const uuid_restriccion = uuid()
    const fecha_creacion = DateTime.now()
    fecha_creacion.setZone("America/Santiago")
    fecha_creacion.setLocale('es-CL')
    
    const docRef = this.firestore.collection("restrictions").doc(uuid_restriccion);
    const createRestriction = {
      ...createRestrictionDto,
      isActive: true,
      fecha_creacion: fecha_creacion.toLocaleString(DateTime.DATETIME_SHORT)
    }
    await docRef.set(createRestriction);
    const restriction = {
      uuid_restriccion: uuid_restriccion,
      ...createRestriction
    }
    return restriction
  }

  async deleteRestriccion(updateRestrictionDto: UpdateRestrictionDto) {
    const checkRef = this.firestore.collection("restrictions").doc(updateRestrictionDto.uuid_restriccion)
    const snapshotCheck = await checkRef.get();

    if(!snapshotCheck.exists) {
      throw new NotFoundException('No existe el documento con la uuid_restriccion recibida')
    }

    const data = snapshotCheck.data()

    

    if(data['uuid_estudiante'] == updateRestrictionDto.uuid_estudiante) {

      //if(data['isActive'] == false) {
      //  const res = {
      //    message: "La restricción ya se encontraba eliminada"
      //  }
      //  return res
      //}

      const updateData = {
        uuid_restriccion: updateRestrictionDto.uuid_restriccion,
        ...data,
        isActive: false,
      }
      await checkRef.update(updateData)
      return updateData
    } else {
      throw new NotFoundException('El uuid_estudiante recibido no se encuentra asociado al uuid_restriccion entregado, porfavor ingrese el uuid_estudiante correctamente')
    }
    
  }

}
