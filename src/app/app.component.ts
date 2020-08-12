import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import sha256 from 'crypto-js/sha256';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ChessWeb3D';

  constructor(private firestore: AngularFirestore) { }

  async ngOnInit(): Promise<any> {

    const roomsCollections = this.firestore.collection('rooms');

    const roomsQuerySnapshot = await roomsCollections.get().toPromise();

    roomsQuerySnapshot.docs.forEach(room => {
      // Expired Room
      if (Number(room.data().expiresAt) < Date.now()) {

        const roomId: string = sha256(room.data().roomName + room.data().roomPassword).toString();

        roomsCollections.doc(roomId).delete()
          .catch(err => console.error(err));
      }
    });
  }
}
