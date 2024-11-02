import { TestBed } from '@angular/core/testing';

import { ChatwootService } from './chatwoot.service';

describe('ChatwootService', () => {
  let service: ChatwootService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatwootService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
