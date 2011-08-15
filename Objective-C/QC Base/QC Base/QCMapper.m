/*
 Copyright (c) 2008, 2009 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 The end-user documentation included with the redistribution, if any, must 
 include the following acknowledgment: 
 "This product was created using the QuickConnect framework.  http://www.quickconnectfamily.org", 
 in the same place and form as other third-party acknowledgments.   Alternately, this acknowledgment 
 may appear in the software itself, in the same form and location as other 
 such third-party acknowledgments.
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 */

#import "QCMapper.h"
#import "QCControlObject.h"
/*
 *	Private methods
 */
@interface QCMapper (Private)

//this is the active method for which the public mapCommandTo*** methods are a facade.
- (void) mapCommandToCO:(NSString*)aCommand withHandler:(Class)aHandlerClass toMap:(NSMutableDictionary*)aMap;

//this is the active method for which the public dispatchTo***CO methods are a facade
- (id) dispatchToCO: (NSString*)command withParameters: (NSArray*)parameters andMap:(NSDictionary*)aMap;
- (id) dispatchToCO: (NSString*)command withParameters: (NSArray*)parameters andMap:(NSDictionary*)aMap startingAt:(int)startingIndex;

- (id) executeCOs:(NSArray*) allParams withMap:(NSDictionary*) theMap;

@end

@implementation QCMapper


@synthesize databases;
@synthesize validationMap;
@synthesize businessMap;
@synthesize viewMap;
@synthesize errorMap;
@synthesize securityMap;



/*
 *	Below is the initialization method for this class and the implementations
 *	of the private methods you should be using in the buildMaps method. 
 */



- (id)init {
	if ((self = [super init])) {
		//prepare each of the maps for use in the application
		self->validationMap = [[NSMutableDictionary alloc] initWithCapacity:0];
		self->businessMap = [[NSMutableDictionary alloc] initWithCapacity:0];
		self->viewMap = [[NSMutableDictionary alloc] initWithCapacity:0];
		self->errorMap = [[NSMutableDictionary alloc] initWithCapacity:0];
		self->securityMap = [[NSMutableDictionary alloc] initWithCapacity:0];
		//self.theDatabaseDefinitions = [[DatabaseDefinitions alloc] initDatabases];
        self->databases = [[NSMutableDictionary alloc] initWithCapacity:0];
		
	}
	//NSLog(@"done calling controller init: %@",self);
	return self;
}


- (void) mapCommandToValCO:(NSString*)aCommand withHandler:(Class)aHandlerClass;{ 
	//NSLog(@"mapping ValCO");
	[self mapCommandToCO:aCommand withHandler:aHandlerClass toMap:self->validationMap];
}
- (void) mapCommandToBCO:(NSString*)aCommand withHandler:(Class)aHandlerClass;{
	//NSLog(@"mapping BCO");
	[self mapCommandToCO:aCommand withHandler:aHandlerClass toMap:self->businessMap];
}
- (void) mapCommandToVCO:(NSString*)aCommand withHandler:(Class)aHandlerClass;{
	//NSLog(@"mapping VCO");
	[self mapCommandToCO:aCommand withHandler:aHandlerClass toMap:self->viewMap];
}
- (void) mapCommandToECO:(NSString*)aCommand withHandler:(Class)aHandlerClass;{
	//NSLog(@"mapping ECO");
	[self mapCommandToCO:aCommand withHandler:aHandlerClass toMap:self->errorMap];
}
- (void) mapCommandToSCO:(NSString*)aCommand withHandler:(Class)aHandlerClass;{
	//NSLog(@"mapping SCO");
	[self mapCommandToCO:aCommand withHandler:aHandlerClass toMap:self->securityMap];
}

- (void) mapCommandToCO:(NSString*)aCommand withHandler:(Class)aHandlerClass toMap:(NSMutableDictionary*)aMap{
	NSMutableArray *controlObjects = [aMap objectForKey:aCommand];
	if(controlObjects == nil){
		//NSLog(@"adding a new list");
		NSMutableArray *tmpCntrlObjs = [[NSMutableArray alloc] initWithCapacity:1];
		[aMap setObject: tmpCntrlObjs forKey:aCommand];
		controlObjects = tmpCntrlObjs;
		[tmpCntrlObjs release];
	}
	//get the control object's class for the given name and add an object of that type to the array for the command.
	//Class aClass = NSClassFromString(aHandlerClassName);
	if(aHandlerClass != nil){
		[controlObjects addObject:aHandlerClass];
	}
	else{
		NSLog(@"Error: unable to map the %@ class.  Make sure that it exists under this name and try again.",aHandlerClass);
	}
}

-(void)dealloc{
	[self->validationMap dealloc];
	[self->businessMap dealloc];
	[self->viewMap dealloc];
	[self->errorMap dealloc];
	[self->securityMap dealloc];
	[super dealloc];
}

@end
