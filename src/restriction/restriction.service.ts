import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestrictionDto } from './dto/create-restriction.dto';
import { UpdateRestrictionDto } from './dto/update-restriction.dto';
import { Firestore, Timestamp } from '@google-cloud/firestore';
import { v4 as uuid } from 'uuid'

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
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() }))
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
    const date = new Date()
    const docRef = this.firestore.collection("restrictions").doc(uuid_restriccion);
    const restriction = {
      ...createRestrictionDto,
      isActive: true,
      date
    }
    await docRef.set(restriction);
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

      if(data['isActive'] == false) {
        const res = {
          message: "La restricción ya se encontraba eliminada"
        }
        return res
      }

      const updateData = {
        ...data,
        isActive: false,
        date: data.date.toDate()
      }
      await checkRef.update(updateData)
      return updateData
    } else {
      throw new NotFoundException('El uuid_estudiante recibido no se encuentra asociado al uuid_restriccion entregado, porfavor ingrese el uuid_estudiante correctamente')
    }
    
  }

}
