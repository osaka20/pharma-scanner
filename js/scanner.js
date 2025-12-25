// Barcode scanner module for Pharma Scanner using ZXing

import { showToast, navigateTo, showLoading, hideLoading } from './ui.js';
import { t } from './i18n.js';
import * as db from './db.js';
import { getCurrentUser } from './auth.js';

let codeReader = null;
let currentStream = null;
let isScanning = false;
let videoDevices = [];
let currentDeviceIndex = 0;
let flashEnabled = false;

/**
 * Initialize barcode scanner
 */
export async function initScanner() {
  // Check if ZXing is available
  if (typeof ZXing === 'undefined') {
    console.error('ZXing library not loaded');
    return;
  }
  
  try {
    // Initialize code reader
    codeReader = new ZXing.BrowserMultiFormatReader();
    
    // Get video devices
    videoDevices = await codeReader.listVideoInputDevices();
    
    if (videoDevices.length === 0) {
      showToast(t('error_camera_not_found'), 'error');
      return;
    }
    
    console.log('Scanner initialized with', videoDevices.length, 'camera(s)');
  } catch (error) {
    console.error('Error initializing scanner:', error);
    showToast(t('error_camera_permission'), 'error');
  }
}

/**
 * Start scanning
 */
export async function startScanning() {
  if (isScanning) return;
  
  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    const video = document.getElementById('scanner-video');
    video.srcObject = stream;
    currentStream = stream;
    
    // Start decoding
    isScanning = true;
    
    codeReader.decodeFromVideoDevice(
      videoDevices[currentDeviceIndex]?.deviceId || undefined,
      'scanner-video',
      async (result, err) => {
        if (result) {
          await handleBarcodeDetected(result.text);
        }
        
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error('Scanner error:', err);
        }
      }
    );
    
    console.log('Scanning started');
  } catch (error) {
    console.error('Error starting scanner:', error);
    
    if (error.name === 'NotAllowedError') {
      showToast(t('error_camera_permission'), 'error');
    } else if (error.name === 'NotFoundError') {
      showToast(t('error_camera_not_found'), 'error');
    } else {
      showToast(t('error'), 'error');
    }
    
    isScanning = false;
  }
}

/**
 * Stop scanning
 */
export function stopScanning() {
  if (!isScanning) return;
  
  try {
    // Stop code reader
    if (codeReader) {
      codeReader.reset();
    }
    
    // Stop video stream
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }
    
    // Clear video
    const video = document.getElementById('scanner-video');
    if (video) {
      video.srcObject = null;
    }
    
    isScanning = false;
    flashEnabled = false;
    
    console.log('Scanning stopped');
  } catch (error) {
    console.error('Error stopping scanner:', error);
  }
}

/**
 * Handle barcode detected
 */
async function handleBarcodeDetected(barcode) {
  if (!barcode) return;
  
  // Stop scanning temporarily
  stopScanning();
  
  // Vibrate if supported
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
  
  // Play beep sound (if available)
  playBeep();
  
  showToast(t('barcode_detected') + ': ' + barcode, 'success');
  
  // Check if product exists
  const user = getCurrentUser();
  if (user) {
    const existingProduct = await db.getProductByBarcode(barcode, user.id);
    
    if (existingProduct) {
      // Show existing product
      const confirmed = await confirm(
        `${t('product_found')}: ${existingProduct.name}. ${t('view_details')}?`
      );
      
      if (confirmed) {
        // Navigate to product details or products view
        navigateTo('products');
        // Could show product detail modal here
      }
    } else {
      // Ask to add new product
      const confirmed = await confirm(
        `${t('product_not_found')}\n${t('barcode')}: ${barcode}\n${t('add_this_product')}?`
      );
      
      if (confirmed) {
        // Navigate to add product form with barcode pre-filled
        navigateTo('product-form');
        document.getElementById('product-barcode').value = barcode;
      }
    }
  }
  
  // Go back to previous view
  navigateTo('dashboard');
}

/**
 * Toggle flash/torch
 */
export async function toggleFlash() {
  if (!currentStream) return;
  
  try {
    const track = currentStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    
    if (capabilities.torch) {
      flashEnabled = !flashEnabled;
      await track.applyConstraints({
        advanced: [{ torch: flashEnabled }]
      });
      
      // Update button visual
      const flashBtn = document.getElementById('flash-btn');
      if (flashBtn) {
        flashBtn.style.background = flashEnabled ? 'var(--warning)' : '';
      }
    } else {
      showToast(t('flash_not_supported'), 'warning');
    }
  } catch (error) {
    console.error('Error toggling flash:', error);
    showToast(t('error'), 'error');
  }
}

/**
 * Switch camera (front/back)
 */
export async function switchCamera() {
  if (videoDevices.length <= 1) {
    showToast(t('no_other_camera'), 'warning');
    return;
  }
  
  // Stop current scanning
  stopScanning();
  
  // Switch to next camera
  currentDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
  
  // Restart scanning with new camera
  await startScanning();
  
  showToast(t('camera_switched'), 'success');
}

/**
 * Play beep sound
 */
function playBeep() {
  try {
    const audio = new Audio('/assets/sounds/beep.mp3');
    audio.play().catch(err => console.log('Could not play beep:', err));
  } catch (error) {
    // Sound not available, ignore
  }
}

/**
 * Simple confirm dialog
 */
async function confirm(message) {
  return new Promise((resolve) => {
    const confirmed = window.confirm(message);
    resolve(confirmed);
  });
}

/**
 * Initialize scanner UI controls
 */
export function initScannerControls() {
  const flashBtn = document.getElementById('flash-btn');
  const switchCameraBtn = document.getElementById('switch-camera-btn');
  const closeScannerBtn = document.getElementById('close-scanner-btn');
  const scanBarcodeBtn = document.getElementById('scan-barcode-btn');
  const quickScanBtn = document.getElementById('quick-scan-btn');
  
  // Flash button
  if (flashBtn) {
    flashBtn.addEventListener('click', toggleFlash);
  }
  
  // Switch camera button
  if (switchCameraBtn) {
    switchCameraBtn.addEventListener('click', switchCamera);
  }
  
  // Close scanner button
  if (closeScannerBtn) {
    closeScannerBtn.addEventListener('click', () => {
      stopScanning();
      navigateTo('dashboard');
    });
  }
  
  // Scan barcode button (in product form)
  if (scanBarcodeBtn) {
    scanBarcodeBtn.addEventListener('click', async () => {
      navigateTo('scanner');
      await startScanning();
    });
  }
  
  // Quick scan button (in dashboard)
  if (quickScanBtn) {
    quickScanBtn.addEventListener('click', async () => {
      navigateTo('scanner');
      await startScanning();
    });
  }
  
  // Listen for scanner view activation
  const navItems = document.querySelectorAll('.nav-item[data-view="scanner"]');
  navItems.forEach(item => {
    item.addEventListener('click', async () => {
      await startScanning();
    });
  });
  
  // Listen for view changes to stop scanner when leaving scanner view
  const allNavItems = document.querySelectorAll('.nav-item');
  allNavItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.dataset.view !== 'scanner' && isScanning) {
        stopScanning();
      }
    });
  });
}

/**
 * Get scanner status
 */
export function isScannerActive() {
  return isScanning;
}
