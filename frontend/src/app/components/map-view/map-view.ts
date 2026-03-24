import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { ReportService } from '../../services/report';
import { WasteReport } from '../../models/waste-report.model';

@Component({
  selector: 'app-map-view',
  imports: [CommonModule],
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
})
export class MapView implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  reports: WasteReport[] = [];
  isLoading = true;
  mapCenter = { lat: 15.1474, lng: 120.5957 }; // Malabanias coordinates
  selectedReportId = '';

  private map: any;
  private leaflet: any;
  private markersLayer: any;
  private readonly isBrowser: boolean;
  private markerById = new Map<string, any>();

  constructor(
    private reportService: ReportService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.loadReports();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initializeMap();
    this.renderMarkers();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  async initializeMap(): Promise<void> {
    if (!this.isBrowser || this.map || !this.mapContainer) {
      return;
    }

    const L = await import('leaflet');
    this.leaflet = L;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.mapCenter.lat, this.mapCenter.lng],
      zoom: 13,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
  }

  loadReports() {
    this.isLoading = true;
    this.reportService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
        this.renderMarkers();
      },
      error: () => {
        this.reports = [];
        this.isLoading = false;
      }
    });
  }

  renderMarkers(): void {
    if (!this.map || !this.leaflet || !this.markersLayer) {
      return;
    }

    this.markersLayer.clearLayers();
    this.markerById.clear();

    const validReports = this.reports.filter(
      (report) =>
        typeof report.location?.latitude === 'number' &&
        typeof report.location?.longitude === 'number'
    );

    validReports.forEach((report) => {
      const marker = this.leaflet
        .circleMarker([report.location.latitude, report.location.longitude], {
          radius: 8,
          color: '#ffffff',
          weight: 2,
          fillColor: this.getMarkerColor(report.status),
          fillOpacity: 0.95
        })
        .bindPopup(
          `<strong>${report.title}</strong><br/>${report.location.address || 'Location captured'}<br/><small>${report.status}</small>`
        );

      marker.addTo(this.markersLayer);
      this.markerById.set(report.id, marker);
    });

    if (validReports.length > 0) {
      const group = this.leaflet.featureGroup(Array.from(this.markerById.values()));
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  getMarkerColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#f39c12';
      case 'ASSIGNED': return '#3498db';
      case 'IN_PROGRESS': return '#9b59b6';
      case 'RESOLVED': return '#27ae60';
      case 'REJECTED': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  onReportClick(report: WasteReport) {
    if (!this.map) {
      return;
    }

    this.selectedReportId = report.id;

    if (typeof report.location?.latitude === 'number' && typeof report.location?.longitude === 'number') {
      this.map.flyTo([report.location.latitude, report.location.longitude], 16, {
        duration: 0.8
      });
    }

    const marker = this.markerById.get(report.id);
    if (marker) {
      marker.openPopup();
    }
  }

  refreshReports(): void {
    this.loadReports();
  }

  centerMap(): void {
    if (!this.map) {
      return;
    }

    if (this.markerById.size > 0 && this.leaflet) {
      const group = this.leaflet.featureGroup(Array.from(this.markerById.values()));
      this.map.fitBounds(group.getBounds().pad(0.2));
      return;
    }

    this.map.setView([this.mapCenter.lat, this.mapCenter.lng], 13);
  }
}
