import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StoreService } from '../../services/store-service';
import { Store } from '../../models/Store';
import { Icon, LeafletMap, Marker, TileLayer } from 'leaflet';

@Component({
  selector: 'app-store-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './store-form.html',
  styleUrl: './store-form.css',
})
export class StoreForm implements OnInit, AfterViewInit, OnDestroy {


  formStore !: FormGroup;
  id?: number;
  private map!: any;
  private userMarker: Marker | undefined;
  private latitude: number | null = null;
  private longitude: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: StoreService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.formStore = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      //latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      //longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
    })

    this.id = this.route.snapshot.params['id'];


  }

  ngAfterViewInit(): void {
    this.initMap(-38.00042, -57.5562);

    if (this.id) {
      this.service.getStoreById(this.id).subscribe(store => {
        this.formStore.patchValue(store);
        this.latitude = store.latitude;
        this.longitude = store.longitude;
        this.getStoreLocation(store.latitude, store.longitude);

      })
    } else{
      this.getUserLocation();
    }

  }


  private initMap(latitude: number, longitude: number) {
    this.map = new LeafletMap('map').setView([latitude, longitude], 13);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }


  getUserLocation() {
    if (navigator.geolocation) {

      const myIcon = new Icon({
        iconUrl: '/assets/maps/marker-icon.png',
        iconSize: [25, 41]
      })

      navigator.geolocation.getCurrentPosition((position) => {

        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        if (this.userMarker) {
          this.userMarker = new Marker(coords);
        } else {
          this.userMarker = new Marker(coords, {
            icon: myIcon,
            draggable: true
          })
            .addTo(this.map)
            .bindPopup('Estas aqui. Mueve el marcador para posicionar exactamente tu comercio.')
            .openPopup();

          this.userMarker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            marker.setLatLng(position).openPopup();
            this.map.setView(position, 19);
            this.latitude = position.lat;
            this.longitude = position.lng;
          })
        }

        this.map.setView(coords, 19);
      }, () => {
        alert('No se pudo obtener la geolocalizacion.\nPara poder crear un nuevo comercio activa la geolocalizacion en tu navegador o dispostivo');
      }

      )
    } else {
      alert('Geolocalizacion no soportada por el navegador\nPara poder crear un nuevo comercio activa la geolocalizacion en tu navegador o dispostivo');
    }

  }

  getStoreLocation(latitude: number, longitude: number) {

      const myIcon = new Icon({
        iconUrl: '/assets/maps/marker-icon.png',
        iconSize: [25, 41]
      })
      if (this.userMarker) {
          this.userMarker = new Marker([latitude, longitude]);
      } else {
          this.userMarker = new Marker([latitude, longitude], {
            icon: myIcon,
            draggable: true
          })
            .addTo(this.map)
            .bindPopup('Tu comercio esta aqui. Mueve el marcador para posicionar exactamente tu comercio.')
            .openPopup();
 
          this.userMarker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            marker.setLatLng(position).openPopup();
            this.map.setView(position, 19);
            this.latitude = position.lat;
            this.longitude = position.lng;
          })
      }

        this.map.setView([latitude, longitude], 19);
      

  }

  onSubmit() {
    if (this.formStore.invalid || this.latitude == null || this.longitude == null) return;

    if (this.id) {
      const storeData: Store = {
        id: this.id,
        ... this.formStore.value,
        latitude: this.latitude,
        longitude: this.longitude
      };
      this.service.updateStore(storeData).subscribe({
        next: () => this.router.navigate(['/store/list']),
        error: (e) => { console.log(e) }
      })
      alert("Comercio actualizado")
    } else {
      const storeData: Store = {
        ... this.formStore.value,
        latitude: this.latitude,
        longitude: this.longitude
      }
      this.service.addStore(storeData).subscribe({
        next: () => this.router.navigate(['/store/list']),
        error: (e) => { console.log(e) }
      })
      alert("Comercio creado")
    }
    this.formStore.reset()
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

}
