//
//  RequestOperation.h
//  iPhoneDevConQueryExample
//
//  Created by Lee Barney on 10/4/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>

@class QCMapper;
@class NSPersistentStoreCoordinator;

@interface QCRequestHandler : NSOperation {
	NSString *command;
	NSMutableDictionary *parameters;
    NSOperationQueue *queue;
	QCMapper *mapper;
    
	NSCondition *condition;
    NSPersistentStoreCoordinator *coordinator;
	
}
@property(nonatomic,retain) NSString *command;
@property(nonatomic,retain) NSMutableDictionary *parameters;
@property(nonatomic,retain) QCMapper *mapper;
@property(nonatomic, retain) NSCondition *condition;
@property(nonatomic, retain) NSOperationQueue *queue;
@property(nonatomic, retain) NSPersistentStoreCoordinator *coordinator;

- (BOOL) dispatchToValCO;
- (BOOL) dispatchToBCO;
- (BOOL) dispatchToVCO;
- (BOOL) dispatchToECO: (NSString*)errorCommand withParameters: (NSMutableDictionary*)parameters;


- (id) initWithCommand:(NSString*)aCommand andParameters:(NSMutableDictionary*)theParameters usingController:(QCMapper*)theAppController andCoordinator:(NSPersistentStoreCoordinator*)aCoordinator;

@end
